import React from "react"
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea' 
import MarkdownMessage from '../components/custom/MarkdownMessage'
import SelectModel from '../components/custom/SelectModel'
import { Model } from '../types'
import { fetchReplyOnce, fetchReplyStream } from '../api'
import LoadingThinking from "../components/custom/LoadingThinking"

const Lab = () => {
  const [model, setModel] = React.useState<Model | null>(null)
  const [seed, setSeed] = React.useState<number>(1)
  const [temperature, setTemperature] = React.useState<number>(0.9)
  const [prompt, setPrompt] = React.useState<string>("")
  const [reply, setReply] = React.useState<string>("")
  const [thinking, setThinking] = React.useState<boolean>(false)
  const handleFetchResponse = async () => {
    if (model && prompt!="") {
      setThinking(true)
      const res = await fetchReplyOnce(model.name, prompt)
      setThinking(false)
      setReply(res)
    }
  }

  const handleFetchResponseStream = async () => {
    if (model && prompt!="") {
      setReply("")
      setThinking(true)   
      await fetchReplyStream(model.name, prompt, (text) => {
        setThinking(false)
        setReply(prev => prev + text)
      }, (err) => {
        setThinking(false) 
        console.error("failed to fetch stream err:", err)       
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
    <div className="lab">
      <label htmlFor='model'>Model Name</label>
      <SelectModel 
        onFetchComplete={handleOnListModelComplete} 
      />  
      
      <label htmlFor="seed">Seed</label>
      <Input 
        name="seed"
        placeholder="enter a seed value"
        value={seed}
        type="number"
        onChange={(e) => setSeed(Number(e.target.value))}
      />  

      <label htmlFor="temperatore">Temperature</label>
      <Input 
        name="temperature" 
        placeholder="enter temperature value the more the assistance will be more creative"
        value={temperature} 
        type="number"
        onChange={(e) => setTemperature(Number(e.target.value))}
      />  
      <label htmlFor='content'>Content</label>

      <Textarea 
        name="prompt" 
        placeholder="ask a question e.g why the sky is blue?"
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button 
        onClick={handleFetchResponse}
      >Confirm</Button>

      <Button 
        onClick={handleFetchResponseStream}
      >Confirm Via Stram</Button>
      {thinking ? <LoadingThinking/> : <MarkdownMessage text={reply} />}

    </div>
  )
}



export default Lab;
