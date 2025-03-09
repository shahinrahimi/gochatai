import './App.css'
import React from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea' 
import MarkdownMessage from './components/custom/MarkdownMessage'
import SelectModel from './components/custom/SelectModel'
import { Model } from './types'


function App() {
  const [model, setModel] = React.useState<Model | null>(null)
  const [role, setRole] = React.useState<string>("")
  const [content, setContent] = React.useState<string>("")
  const [reply, setReply] = React.useState<string>("")
  const [thinking, setThinkng] = React.useState<boolean>(false)
  
  const fetchStream = async (modelName: string) => {
    const url = "http://localhost:3000/generatestream"
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt: content
      })
    });
    const reader = res.body?.getReader();
    if (!reader){
      return
    }
    const decoder = new TextDecoder()
    let done = false
    //let text = ''
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (doneReading) break
      const chunk = decoder.decode(value, { stream: true })
    // Process line-seprated JONS responses
      const jsonObjects = chunk.trim().split("\n")
      jsonObjects.forEach(element => {
        try {
          const data = JSON.parse(element);
          if (data.response) {
            const text = data.response;
            // Detect and ignore <Think>...</ThinK>
            if (text.includes("<think>")) {
              setThinkng(true)

            } else if (text.includes("</think>")) {
              setThinkng(false)
            } else {
              setReply(prev => prev + text)
            }
          }
        } catch (error) {
          console.log("JSON parsing error: ", error)
        }
        
      });
      //text += decoder.decode(value, { stream: true })
      //console.log(text)
      //setReply((prev) => prev + text)
    }
  }
  const fetchResponse = (modelName: string) => {
    const url = "http://localhost:3000/generate"
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        prompt: content
      })
    })
      .then(data => data.json())
      .then(data => {
    console.log(data)
        setReply(data?.data?.response)
      })
      .catch(err => {
        console.error("error fetching data", err)
      })
  }
  const handleFetchResponse = () => {
    if (model){
      fetchResponse(model.name)
    } 
  }
  const handleFetchStreamResponse = () => {
    if (model) {
      fetchStream(model.name)
    }
  }
  const handleFetchComplete = (m: Model | null) => {
    setModel(m)
    console.log("Models fethed. Active model: ", m?.name)
  } 
  return (
  <div id="app" className="flex-col w-full">
    <label htmlFor='model'>Model Name</label>
    <SelectModel onFetchComplete={handleFetchComplete} />  
     
    <label htmlFor='role'>Role</label>
    <Input 
      name='role' 
      placeholder='enter role e.g senior backend engineer'
      value={role} 
      onChange={(e) => setRole(e.target.value)}
    />  
    <label htmlFor='content'>Content</label>

    <Textarea 
      name='content' 
      placeholder='ask a question e.g why the sky is blue?'
      value={content} 
      onChange={(e) => setContent(e.target.value)}
    />  

    <Button onClick={handleFetchResponse}>Confirm</Button>
    <Button onClick={handleFetchStreamResponse}>Confirm Via Stram</Button>
    {thinking && <ThinkingUE />}
    {!thinking && <MarkdownMessage text={reply} />}
  </div>
  )

}

const ThinkingUE = () => {
  return (
<div className="mt-2 flex items-center text-gray-500">
                    <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    Thinking...
                </div>
  )
}
export default App
