
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Conversation } from "@/api/types";
import { useChat } from "@/context/ChatContext";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarButtonTrigger from "@/components/custom/SidebarButtonTrigger";
import NewConversationButton from "@/components/custom/NewConversationButton";
import { groupConversations } from "@/utils";
import SidebarConversationItem from "@/components/custom/SidbarConversationItem";
import { useCompletion } from "@/context/CompletionContext";

const AppSidebar = ({ ...props }:React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {conversations, clearConversations, deleteConversation} = useChat()

  const grouped = groupConversations(conversations)
  const handleClearConveration = () => {
    clearConversations()
    navigate("/chat")
  }
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      <div className="px-1 py-4 flex justify-between">
        <SidebarButtonTrigger />
        <NewConversationButton onClick={() => navigate("/chat")} />
      </div>
      </SidebarHeader>
      <SidebarContent>
         <SidebarGroup>
          <SidebarMenu>
          {Object.entries(grouped).map(([label, items]) => 
            items.length > 0 ? (
              <div key={label} className="mb-4">
                <div className="px-4 py-2 text-sm font-medium text-gray-500">{label}</div> 
                  {items.map((c:Conversation) => {
                
                    const isActive = location.pathname === `/chat/${c.id}` 
                    return (
                      <SidebarConversationItem 
                        key={c.id}
                        c={c}
                        root="chat"
                        isActive={isActive}
                        onDelete={deleteConversation}
      
                      />
                    )
                  })}
                </div>
            ): null
          )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-2">
              
      <AlertDialog>
        <AlertDialogTrigger className="rounded-sm border-red-300 border-2 hover:bg-red-300 hover:text-white transition-all">Clear Conversations</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete all of your conversations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-300" onClick={() => handleClearConveration()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}


export default AppSidebar;
