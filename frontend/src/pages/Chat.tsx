import React from "react";
import MessageList from "@/container/MessageList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import SelectModel from "@/components/custom/SelectModel";
import { useLocalModel } from "@/hooks/useModels";
import { Bot } from "lucide-react";
import LoadingThreedot from "@/components/custom/LoadingThreedot";
import { useParams, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useChat } from "@/context/ChatContext";
import SidebarButtonTrigger from "@/components/custom/SidebarButtonTrigger";
import NewConversationButton from "@/components/custom/NewConversationButton";
const Chat = () => {
  
  const navigate = useNavigate()
  const { id } = useParams<{id:string}>()
  const {open } = useSidebar()
  
  const {model, models, setModel} = useLocalModel("completion-lab")
  
  const {
    input,
    setInput,
    handleSubmit,
    isLoading,
    createConversation,
    currentConversation,
    setCurrentId,
  } = useChat()

  const hasCreatedRef = React.useRef(false)

  React.useEffect(() => {
    if (!id && !hasCreatedRef.current) {
      hasCreatedRef.current = true // block recreate new chat
      const newId = createConversation("New Chat") 
      navigate(`/chat/${newId}`)
    } else if (id) {
      setCurrentId(id)
    }
  },[id])

   
  const handleFormSubmit = (e: React.FormEvent) => {
    if (model){
      handleSubmit(e, model.name);
    }
  }

  if (!currentConversation) {
    return <div className="p-4">Conversation not found.</div>
  }

  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
        <header className="p-4 border-b flex justify-between items-center ">
          <div className="flex gap-2">
            {!open &&  (
              <div className="flex gap-2">
              <SidebarButtonTrigger />
              <NewConversationButton />
              </div>
            )}
            <SelectModel 
              model={model} 
              setModel={setModel} 
              models={models} 
            />
            
          </div>
          <h1 className="flex flex-row-reverse text-xl justify-center items-center gap-4">
              <span>
                <Bot size={40} />
                <LoadingThreedot loading={isLoading} />
              </span>
          </h1>
      </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-7xl mx-auto">
          {currentConversation ? (
            <MessageList messages={currentConversation.messages} />
          ): (

            <MessageList messages={[]} />
          )}
          </div>
        </div>

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

export default Chat;
