import React from "react";
import {MessageSquarePlus} from "lucide-react"
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
import { Conversation } from "@/api/types";
import { useConversation } from "@/context/ConversationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SidebarButtonTrigger from "./SidebarButtonTrigger";
import NewConversationButton from "./NewConverstaionButton";

const AppSidebar = ({ ...props }:React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {conversations, clearConverstaions} = useConversation()
  const handleClearConveration = () => {
    clearConverstaions()
    navigate("/chat")
  }
  const handleNewConveration = () => {
    navigate("/chat")
  }
  React.useEffect(() =>{
    console.log(open)
  },[open])

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
      <SidebarFooter>
        <SidebarMenuButton className="bg-green-200 capitalize" onClick={handleNewConveration}>
          new converastion 
        </SidebarMenuButton>
        <SidebarMenuButton className="bg-orange-200 capitalize" onClick={handleClearConveration}>
          clear converastion 
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}


export default AppSidebar;
