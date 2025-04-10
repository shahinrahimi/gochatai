import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { useConversation } from "@/context/ConversationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SidebarButtonTrigger from "@/components/custom/SidebarButtonTrigger";
import NewConversationButton from "@/components/custom/NewConverstaionButton";
import { groupConversations, ConversationGroup } from "@/utils";
const ChatSidebar = ({ ...props }:React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {conversations, clearConverstaions} = useConversation()

  const grouped = groupConversations(conversations)
  const handleClearConveration = () => {
    clearConverstaions()
    navigate("/chat")
  }
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      <div className="px-1 py-4 flex justify-between">
        <SidebarButtonTrigger />
        <NewConversationButton />
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
                      <SidebarMenuItem key={c.id} >
                        <SidebarMenuButton 
                          asChild
                          className={isActive ? "bg-gray-200 font-semibold" : ""}
                        >
                        <Link to={`/chat/${c.id}`}>{c.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
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


export default ChatSidebar;
