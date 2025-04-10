import React from 'react';
import {Outlet} from 'react-router-dom'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from '@/global/ChatSidebar';

const ChatLayout = () => { 
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
          <Outlet />
      </SidebarInset>
    </SidebarProvider>

  ) 
}


export default ChatLayout;
