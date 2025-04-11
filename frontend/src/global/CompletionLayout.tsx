
import React from 'react';
import {Outlet} from 'react-router-dom'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CompletionSidebar from '@/global/CompletionSidbar';
const CompletionLayout = () => { 
  return (
    <SidebarProvider>
      <CompletionSidebar />
      <SidebarInset>
          <Outlet />
      </SidebarInset>
    </SidebarProvider>

  ) 
}


export default CompletionLayout;
