import React from "react"
import {v4 as uuidv4} from "uuid"
import  {Message, Conversation }from "@/api/types";
import { fetchGenerateChatStream } from "@/api/generate-stream";
import { GenerateChatReq } from "@/api/types";

const STORAGE_KEY = "chat-conversations";


interface ConversationContextType {
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
  handleSubmit: (e: React.FormEvent, modelName: string) => void;
  isLoading: boolean;
}

const ConverationContext = React.createContext<ConversationContextType | undefined>(undefined)

export const ConverationProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [conversations, setConversations] = React.useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved): [];
  })
  const [currentId, setCurrentId] = React.useState<string|null>(null)
  const [input, setInput]=React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (conversations.length > 0) {
      const conversationsToSave  = conversations.filter((c:Conversation) => c.messages.length > 0)
      localStorage.setItem("chat-conversations", JSON.stringify(conversationsToSave));
    }
  },[conversations])
  
  const getCurrentConversation = ():Conversation | null => {
    return conversations.find((c:Conversation) => c.id === currentId) || null;
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
    // feaure reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
      created_at: Date.now(),
      updated_at: Date.now()
    }
    
    let conv = getCurrentConversation()
    // create a new conversation if there is no conversation
    if (!conv) {
      createConversation("New Chat 1212");
      conv = getCurrentConversation()
    }
    const req: GenerateChatReq = {
      model:model,
      messages: [...(conv?.messages ?? []), m],
      stream: true,
    }

    addMessageToCurrent(m)
    addMessageToCurrent(featuredMessage)
    setInput("")
   
    fetchGenerateChatStream(
      req,
      (resp) => {
        updateLastAssistantMessage(resp.message.content)
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
    handleSubmit,
    isLoading

  }

  return (
    <ConverationContext.Provider value={value}>
      {children}
    </ConverationContext.Provider>
  )
}

export const useConversation = () => {
  const ctx = React.useContext(ConverationContext);
  if (!ctx) throw new Error("useConversation must be used within ConversationProvider")
  return ctx
}
