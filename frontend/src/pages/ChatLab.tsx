
import React from "react";
import MessageList from "@/container/MessageList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import SelectModel from "@/components/custom/SelectModel";
import { useLocalModel } from "@/hooks/useModels";
import { useChat } from "@/hooks/useChat";
import { Bot } from "lucide-react";
import LoadingThreedot from "@/components/custom/LoadingThreedot";
import { SidebarTrigger } from "@/components/ui/sidebar";
const ChatLab = () => {

  const {model, models, setModel} = useLocalModel("completion-lab")
  const {
    messages,
    isLoading,
    handleSubmit,
    input,
    setInput,
  } = useChat(model)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])

   
  const handleFormSubmit = (e: React.FormEvent) => {
    //setPrompt("");
    handleSubmit(e);
  }
  
 
  return (
    <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="p-4 border-b flex justify-between items-center bg-white">
          <SidebarTrigger />
          <h1 className="flex flex-row-reverse text-xl justify-center items-center gap-4">
              <span>
                <Bot size={40} />
                <LoadingThreedot loading={isLoading} />
              </span>
              <SelectModel 
                  model={model} 
                  setModel={setModel} 
                  models={models} 
              />
          </h1>
      </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-7xl mx-auto">
          <MessageList messages={messages} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
    </div>
  )

}

export default ChatLab;
