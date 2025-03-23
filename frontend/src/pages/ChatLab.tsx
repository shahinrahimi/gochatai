import React from "react";
import { GenerateChatCompletionReq, LocalModel, Message } from "@/api/types";
import MessageList from "@/container/MessageList";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import LoadingThreedot from "@/components/custom/LoadingThreedot";
import { fetchGenerateChat } from "@/api/generate";
import SelectModel from "@/components/custom/SelectModel";
const ChatLab = () => {
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

  const handleSendMessage = () => {
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

    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, m]
      const req:GenerateChatCompletionReq = {
        model: model.name,
        messages: updatedMessages,
        stream: false
      }

      setIsLoading(true)

      fetchGenerateChat(
        req,
        (content) => {
          const newMessage:Message = {
            content: content,
            role: "assistant"
          }
          setIsLoading(false)
          setMessages(prev => [...prev, newMessage])
        },
        (err) => console.error(err)
      );

      return updatedMessages;
    })

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
          <div className="flex w-full gap-2">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={isLoading || !prompt.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>  )
}


export default ChatLab;



