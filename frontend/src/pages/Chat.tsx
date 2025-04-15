import React from "react";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import SelectModel from "@/components/custom/SelectModel";
import { useLocalModel } from "@/hooks/useModels";
import { Bot } from "lucide-react";
import LoadingThreedot from "@/components/custom/LoadingThreedot";
import { useParams, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useChat } from "@/context/ChatContext";
import SidebarButtonTrigger from "@/components/custom/SidebarButtonTrigger";
import NewConversationButton from "@/components/custom/NewConversationButton";
import ConversationView from "@/container/CoversationView";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/global/AppHeader";

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

  const isActive = (!isLoading) && (input.trim() !== "") && model 

  
  return (
    <div className="flex flex-col h-screen  bg-gray-50">
      <Header />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-7xl mx-auto">
        {currentConversation ? (
          <ConversationView c={currentConversation} />
        ):null}
        </div>
      </div>
       

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleFormSubmit} className="flex-col">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mb-4 focus-visible:ring-0 min-h-24"
              disabled={isLoading}
            />
            <div className="flex justify-between gap-4">
              <SelectModel 
                model={model} 
                setModel={setModel} 
                models={models} 
                className="flex-1 focus:ring-0 h-12 focus:outline-none"
              />
            
              <Button
                className={`flex bg-gray-300 text-gray-600 px-4 py-6 ${isActive ? "bg-cyan-500 text-white": ""}`}
                disabled={!isActive}
                type="submit"
              > 
                <span className="">Run</span>
                <span className={`py-0.5 px-2 border-gray-400 border-1 flex justify-center items-center rounded-sm ${isActive ? "border-white": ""}`}>
                  <CornerDownLeft className="" />  
                </span>
              </Button>
            </div>
          </form>
        </div>
    </div>
  )

}

export default Chat;
