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
import { DeleteIcon } from "lucide-react";
const ChatSidebar = ({ ...props }:React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {conversations, clearConverstaions} = useConversation()
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
            {conversations.map((c:Conversation) =>{ 
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
