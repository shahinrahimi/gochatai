
import React from "react"
import {v4 as uuidv4} from "uuid"
import  {Message, Conversation }from "@/api/types";
import { fetchGenerateCompletionStream } from "@/api/generate-stream";
import { GenerateCompletionReq } from "@/api/types";
import { fetchGenerateCompletion } from "@/api/generate";

const STORAGE_KEY = "completion-conversations";


interface CompletionContextType {
  conversations: Conversation[];
  currentId: string | null;
  setCurrentId: (id: string) => void;
  addMessageToCurrent: (message: Message) => void;
  updateLastAssistantMessage: (content: string) => void;
  createConversation: (title?:string) => string;
  clearConverstaions: () => void;
  getCurrentConversation: () => Conversation | null;
  currentConversation: Conversation | null;

  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  system: string;
  setSystem: React.Dispatch<React.SetStateAction<string>>;
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  seed: string;
  setSeed: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent, modelName: string) => void;
  isLoading: boolean;
}

const CompletionContext = React.createContext<CompletionContextType | undefined>(undefined)

export const CompletionProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [conversations, setConversations] = React.useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved): [];
  })
  const [currentId, setCurrentId] = React.useState<string|null>(null)
  const [input, setInput] = React.useState<string>("")
  const [system, setSystem] = React.useState<string>("")
  const [seed, setSeed] = React.useState<string>("")
  const [temperature, setTemperature] = React.useState<number>(0.7)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    // filter new conversations that is not have any messages
    const conversationsToSave  = conversations.filter((c:Conversation) => c.messages.length > 0)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationsToSave));
  },[conversations])
  
  const getCurrentConversation = ():Conversation | null => {
    return conversations.find((c:Conversation) => c.id === currentId) || null;
  }

  const renameConverstation = (id:string, newTitle: string) => {
    setConversations((prevConvs) =>
      prevConvs.map((c) =>
        c.id === id ? { ...c, title: newTitle, updated_at: Date.now() } : c
      )
    );
  }

  const createConversation = (title = "New Chat"):string => {
    const id = uuidv4() 
    const newConv:Conversation = {
      id,
      title,
      messages:[],
      created_at: Date.now(),
      updated_at: Date.now(),
    }

    setConversations((prev:Conversation[]) => [newConv, ...prev])
    setCurrentId(id)
    return id;
  }

  const addMessageToCurrent = (message: Message) => {
    setConversations((prev:Conversation[]) => 
      prev.map((conv:Conversation) => {
        if (conv.id === currentId) {
          return {...conv, messages: [...conv.messages, message], updated_at: Date.now()}
        }else {
          return conv
        } 
      })
    )
  }
  const updateLastAssistantMessage = (content: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== currentId) return conv;
        const updated = [...conv.messages];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: last.content + content,
            updated_at: Date.now(),
          };
        }
        return { ...conv, messages: updated, updated_at: Date.now() };
      })
    );
  };

  const clearConverstaions = () => {
    setConversations([]);
    setCurrentId(null)    
  }


  const handleSubmit = (e:React.FormEvent, model:string) => {
    e.preventDefault()
    if (input.trim() == "") {
      console.log("the prompt can't be empty string")
      return
    }

    if (!model){
      console.log("useCompletion: the model can not be empty")
      return 
    }

    // add prompt to messages with role user
    const m:Message = {
      content: input,
      role: "user",
      created_at: Date.now(),
      updated_at: Date.now()
    }


    // specify the title
        // feaure reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
      created_at: Date.now(),
      updated_at: Date.now()
    }
    
    let conv = getCurrentConversation()
    if (conv?.messages.length === 0) {
      const reqTitle :GenerateCompletionReq = {
        system: "You are a naming assistant. Given a input as system prompt that describes a tool or AI assistant, generate a short, clear, and creative name that reflects the tool’s purpose. The name should be between 2 to 5 words, memorable, and relevant to the described function. Avoid overly generic names unless contextually fitting.",
        prompt: system ? system : input,
        model: model,
        stream: false,
      }


    fetchGenerateCompletion(
      reqTitle,
      (resp) => {
        if (currentId) {
          renameConverstation(currentId, resp) 
        }
      },
      (error) => console.log(error)
    )

    }

    const req: GenerateCompletionReq = {
      model:model,
      system: system,
      prompt: input,
      stream: true,
    }

    addMessageToCurrent(m)
    addMessageToCurrent(featuredMessage)
    setInput("")
    setIsLoading(true)
   
    fetchGenerateCompletionStream(
      req,
      (resp) => {
        updateLastAssistantMessage(resp.response)
        if (resp.done) setIsLoading(false)
      },
      (err) => {
        console.log(err)
        setIsLoading(false)
      }
    ) 
  }

  const value = {
    conversations,
    currentConversation: getCurrentConversation(),
    currentId,
    setCurrentId,
    addMessageToCurrent,
    updateLastAssistantMessage,
    createConversation,
    clearConverstaions,
    getCurrentConversation,
    
    setInput,
    input,
    setSystem,
    system,
    setTemperature,
    temperature,
    seed,
    setSeed,
    
    handleSubmit,
    isLoading

  }

  return (
    <CompletionContext.Provider value={value}>
      {children}
    </CompletionContext.Provider>
  )
}

export const useCompletion = () => {
  const ctx = React.useContext(CompletionContext);
  if (!ctx) throw new Error("useCompletion must be used within CompletionProvider")
  return ctx
}


