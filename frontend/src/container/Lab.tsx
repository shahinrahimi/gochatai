import React from "react"
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea' 
import WelcomeAI  from './welcome-ai.tsx'
import MarkdownMessage from '../components/custom/MarkdownMessage'
import SelectModel from '../components/custom/SelectModel'
import { Model } from '../types'
import { fetchReplyOnce, fetchReplyStream } from '../api'
import LoadingThinking from "../components/custom/LoadingThinking"
type Sender = "user" | "assistante"
type Message = {
  id: number;
  content: string;
  sender: Sender;
  timestamp: string;
}
const Lab = () => {
  const [model, setModel] = React.useState<Model | null>(null)
  const [seed, setSeed] = React.useState<number>(1)
  const [temperature, setTemperature] = React.useState<number>(0.9)
  const [prompt, setPrompt] = React.useState<string>("")
  const [reply, setReply] = React.useState<string>("")
  const [messages, setMessages] = React.useState<Message[]>([])
  const [thinking, setThinking] = React.useState<boolean>(false)
  const [system, setSystem] = React.useState<string>("")

  const addMessage = (text: string, sender:Sender) => {
    const newMessage: Message = {
      id: messages.length + 1,
      content: text,
      sender,
      timestamp: new Date().toISOString()
    }
    setMessages((prev:Message[]) => [...prev, newMessage])
  }

  const handleFetchResponse = async () => {
    if (model && prompt!="") {
      if (reply != "") {
        addMessage(reply, "assistante")
      }
      addMessage(prompt, "user")
      setReply("")
      setThinking(true)
      await fetchReplyOnce({
        model: model.name,
        prompt: prompt
      }, (res) => {
        setThinking(false)
        setReply(res)
      }, (err) => {
        setThinking(false)
        console.log("Error fetching response: ", err)
      })
    }
  }

  const handleFetchResponseStream = async () => {
    if (model && prompt!="") {
      // save already reply
      if (reply != "") {
        addMessage(reply, "assistante")
      }
      addMessage(prompt, "user")
      setReply("")
      setThinking(true)   
      await fetchReplyStream({
        model: model.name,
        prompt: prompt,
        system: "You are drunk one that lost every things in the life! answer like a drunk one.",
        options: {
          seed: seed,
          temperature: temperature,
        },
      }, (text) => {
        setThinking(false)
        setReply(prev => prev + text)
      }, (err) => {
        setThinking(false) 
        console.error("Error fetching sreeam response err:", err)       
      })
    }
  }

  const handleOnListModelComplete = (m: Model | null) => {
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
        {reply != "" && <RenderMessages ms={messages} />}
        {reply != "" && !thinking && <MarkdownMessage text={reply} />}
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
         <Button onClick={handleFetchResponse}
          >Confirm</Button>
           <Button onClick={handleFetchResponseStream}
          >Confirm Via Stram</Button>
      </div>
    </div>
    </div>
    
  )
}
interface RenderMessageInterface {
  ms: Message[]
}

const RenderMessages = ({ms}: RenderMessageInterface) => {
  return (
    <ol>{ms.map((m:Message) => {
      return (
        <li key={m.id}>{m.content}</li>
      )
    })}
    </ol>

  )
}



export default Lab;
