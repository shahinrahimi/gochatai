
import React from "react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea' 
import WelcomeAI  from './welcome-ai.tsx'
import { MarkdownMessage, MarkdownWithCode } from '@/components/custom/MarkdownMessage'
import SelectModel from '@/components/custom/SelectModel'
import { fetchGenerate, fetchGenerateChat } from '@/api/generate'
import { fetchGenereateStream, fetchGenereateChatStream } from '@/api/generate-stream'
import { RunningModel, GenerateCompletionReq, GenerateChatCompletionReq, Message, Role} from '@/api/types.ts'
import LoadingThinking from "@/components/custom/LoadingThinking"
const Chat = () => {
  const [model, setModel] = React.useState<RunningModel | null>(null)
  const [seed, setSeed] = React.useState<number>(1)
  const [temperature, setTemperature] = React.useState<number>(0.9)
  const [prompt, setPrompt] = React.useState<string>("")
  const [reply, setReply] = React.useState<string>("")
  const [messages, setMessages] = React.useState<Message[]>([])
  const [thinking, setThinking] = React.useState<boolean>(false)
  const [system, setSystem] = React.useState<string>("")

  const addMessage = (text: string, role: Role) => {
    const newMessage: Message = {
      //id: messages.length + 1,
      role: role, 
      content: text,
      //sender,
      //timestamp: new Date().toISOString()
    }
    setMessages((prev:Message[]) => [...prev, newMessage])
  }

  const handleFetchGenerate = async () => {
    if (model && prompt!="") {
      if (reply != "") {
        addMessage(reply, "assistant")
      }
      addMessage(prompt, "user")
      setReply("")
      setThinking(true)
      const payload :GenerateCompletionReq = {
        model: model.name,
        prompt: prompt,
        stream: false,
        system: system,
        options: {
          seed: seed,
          temperature: temperature
        }
      }
      await fetchGenerate(
        payload,
        (res) => {
          setThinking(false)
          setReply(res)
        },
        (err) => {
          setThinking(false)
          console.log("failed to fetch response: ", err)
        }
      )
    }
  }

  const handleFetchGeneratedChat = async () => {
    if (model && prompt!="") {
      if (reply != "") {
        addMessage(reply, "assistant")
      }
      addMessage(prompt, "user")
      setReply("")
      setThinking(true)
      const payload :GenerateChatCompletionReq = {
        model: model.name,
        messages: messages,
        stream: false,
      }
      await fetchGenerateChat(
        payload,
        (res) => {
          setThinking(false)
          setReply(res)
        },
        (err) => {
          setThinking(false)
          console.log("failed to fetch response: ", err)
        }
      )
    }
  }


  const handleFetchGenerateStream = async () => {
    if (model && prompt!="") {
      // save already reply
      if (reply != "") {
        addMessage(reply, "assistant")
      }
      addMessage(prompt, "user")
      setReply("")
      setThinking(true)   
      const payload :GenerateCompletionReq = {
        model: model.name,
        prompt: prompt,
        stream: true,
        system: system,
        options: {
          seed: seed,
          temperature: temperature
        }
      }

      await fetchGenereateStream(
        payload,
        (text) => {
          setThinking(false)
          setReply(prev => prev + text)
        }, 
        (err) => {
          setThinking(false) 
          console.error("Error fetching sreeam response err:", err)       
      })
    }
  }
  const handleFetchGenerateChatStream = async () => {
    if (model && prompt!="") {
      // save already reply
      if (reply != "") {
        addMessage(reply, "assistant")
      }
      addMessage(prompt, "user")
      setReply("")
      setThinking(true)   
      const payload :GenerateChatCompletionReq = {
        model: model.name,
        messages: messages,
        stream: true,
      }

      await fetchGenereateChatStream(
        payload,
        (text) => {
          setThinking(false)
          setReply(prev => prev + text)
        }, 
        (err) => {
          setThinking(false) 
          console.error("Error fetching sreeam response err:", err)       
      })
    }
  }

  const handleOnListModelComplete = (m: RunningModel | null) => {
    if (m) {
      setModel(m)
      console.log("model set to: ", m.name)
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex gap-8 justify-between">
        <div className="flex gap-2 items-center" >
          <label className="text-nowrap" htmlFor='model'>Model Name</label>
          <SelectModel 
            onFetchComplete={handleOnListModelComplete} 
          />  
        </div>
                     
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <label htmlFor="seed">Seed</label>
            <Input 
              name="seed"
              placeholder="enter a seed value"
              value={seed}
              type="number"
              onChange={(e) => setSeed(Number(e.target.value))}
            />    
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="temperature">Temperature</label>
            <Input 
              name="temperature" 
              placeholder="enter temperature value the more the assistance will be more creative"
              value={temperature} 
              type="number"
              onChange={(e) => setTemperature(Number(e.target.value))}
            />     
          </div>
        </div>
      </div>
      <div className="p-2 min-h-10">
        <div className="flex gap-2">

        <label htmlFor="system">System</label>
          <Textarea
            name="system"
            placeholder="enter system promt to override current system"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
          />
        </div>
      </div>
      <div className="p-2 min-h-80">
        {reply == "" && <WelcomeAI />}
        {reply != "" && <MessageList ms={messages} />}
        {reply != "" && !thinking && <MarkdownMessage text={reply} />}
        {reply != "" && !thinking && <MarkdownWithCode text={reply} />}
        {thinking && <LoadingThinking />}
      </div>
      
     <div className="flex-col p-2"> 
      <Textarea 
        name="prompt" 
        placeholder="ask a question e.g why the sky is blue?"
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex py-3 justify-between">
         <Button 
          onClick={handleFetchGenerate}
          >Confirm</Button>
          <Button 
            onClick={handleFetchGeneratedChat}
          >Confirm Chat</Button>
          <Button 
            onClick={handleFetchGenerateChatStream}
          >Confirm Chat Via stream</Button>
          <Button 
            onClick={handleFetchGenerateStream}
          >Confirm Via Stram</Button>
      </div>
    </div>
    </div>
    
  )
}
interface MessageListInterface {
  ms: Message[]
}

const MessageList = ({ms}: MessageListInterface) => {
  return (
    <ol className="my-4 flex h-fit min-h-full flex-col gap-4" >{ms.map((m:Message, index) => {
      return (
        <li 
          key={index} 
          data-role={(m.role).toString()}
          className="max-w-[80%] rounded px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-wihte"
        >
          {m.content}
        </li>
      )
    })}
    </ol>

  )
}



export default Chat;
