
import React from "react";
import MessageList from "@/container/MessageList";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import SelectModel from "@/components/custom/SelectModel";
import { useLocalModel } from "@/hooks/useModels";
import { useChat } from "@/hooks/useChat";
import { Bot } from "lucide-react";
import LoadingThreedot from "@/components/custom/LoadingThreedot";
const ChatLab = () => {
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false)

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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Settings Panel */}
      <div
        className={`${showAdvanced ? "w-full md:w-1/4 p-4 opacity-100" : "w-0 p-0 opacity-0"} transition-all duration-300 overflow-hidden bg-white border-r`}
      >
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Advanced Settings</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <SelectModel model={model} setModel={setModel} models={models} />
          </div>

        </div>
      </div>

      {/* Chat Interface */}
      <div className={`flex-1 flex flex-col ${showAdvanced ? "md:w-2/3" : "w-full"} transition-all duration-300`}>
        {/* Header */}
        <header className="p-4 border-b flex justify-between items-center bg-white">
          <h1 className="flex text-xl justify-center align-baseline gap-4">
            <span className=""><Bot /></span>
            <span className="">{model?.name}</span>
            {isLoading && <span className="flex justify-center items-center"><LoadingThreedot /></span>}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Advanced Mode</span>
            <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          </div>
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
    </div>
  )

}

export default ChatLab;
