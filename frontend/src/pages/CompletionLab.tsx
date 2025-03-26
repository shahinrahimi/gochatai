import React from "react";
import { GenerateCompletionReq, LocalModel, Message } from "@/api/types";
import MessageList from "@/container/MessageList";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot  } from "lucide-react";
import LoadingThreedot from "@/components/custom/LoadingThreedot";
import { fetchGenerateCompletion } from "@/api/generate";
import { fetchGenerateCompletionStream } from "@/api/generate-stream";
import SelectModel from "@/components/custom/SelectModel";
const CompletionLab = () => {
  const [model, setModel] = React.useState<LocalModel | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [prompt, setPrompt] = React.useState<string>("")
  const [messages, setMessages] = React.useState<Message[]>([])

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])
  const handleOnListModelComplete = (m: LocalModel | null) => {
    if (m) {
      setModel(m)
      console.log("model set to: ", m.name)
    }
  }

  const handleGenerateCompletion = () => {
    // add prompt if it is not empty
    if (prompt.trim() == "") {
      console.log("the prompt can't be empty string")
      return
    }

    if (!model){
      console.log("the model can not be empty")
      return 
    }

    // add prompt to messages with role user
    const m:Message = {
      content: prompt,
      role: "user",
    }
    // feature reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
    }

    // create request before updating state
    const req: GenerateCompletionReq= {
      model: model.name,
      prompt: prompt,
      stream: false
    }

    // Update messages state immediatly
    setMessages((prevMessages) => [...prevMessages, m, featuredMessage])

    setIsLoading(true)
    
    fetchGenerateCompletion(
      req,
      (message) => {
        setMessages(prevMessages => {
          return prevMessages.map((em, index) => {
            if (index == prevMessages.length - 1) {
              return {...em, content: message}
            }
            return em
          })
        })
        setIsLoading(false)
      },
      (err) => console.log(err)
    )
  }

  const handleGenerateCompletionStream = () => {
    // add prompt if it is not empty
    if (prompt.trim() == "") {
      console.log("the prompt can't be empty string")
      return
    }

    if (!model){
      console.log("the model can not be empty")
      return 
    }

    // add prompt to messages with role user
    const m:Message = {
      content: prompt,
      role: "user",
    }
    // feaure reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
    }

    // create request before updating state
    const req:GenerateCompletionReq = {
      model: model.name,
      prompt: prompt,
      stream: true 
    }

    // Update messages state immediatly
    setMessages((prevMessages) => [...prevMessages, m, featuredMessage])

    setIsLoading(true)
   
    fetchGenerateCompletionStream(
      req,
      (resp) => {
        setMessages(prevMessages => {
          return prevMessages.map((em,index) => {
            if (index == prevMessages.length - 1) {
              return {...em, content: em.content + resp.response}
            }
            return em
          })
        })
        console.log(resp)
        if (resp.done) setIsLoading(false)
      },
      (err) => console.log(err)
    )
  } 

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-7xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <SelectModel onFetchComplete={handleOnListModelComplete}/>
            AI Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
          <MessageList messages={messages} />
          {isLoading && <LoadingThreedot />}
          <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t">
          <div className="flex w-full gap-2 justify-between">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <div className="flex-col justify-items-center">
              <Button onClick={handleGenerateCompletionStream} className="flex w-full mb-2" size={"lg"} disabled={isLoading || !prompt.trim()}>
                <span>stream</span>
                <span className="sr-only">Send message</span>
              </Button>
              <Button onClick={handleGenerateCompletion} className="flex w-full" variant="secondary" size={"lg"} disabled={isLoading || !prompt.trim()}>
                <span className="sr-only">Send message</span>
                <span>once</span>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>  )
}

export default CompletionLab;
