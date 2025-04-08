import React from "react";
import {MessageCircle} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Conversation } from "@/api/types";
import { useConversation } from "@/context/ConversationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <MessageCircle className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Conversations</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
       </SidebarMenu> 
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
