import React from 'react';
import {Outlet} from 'react-router-dom'
import AppSidebar from "@/components/custom/AppSidebar" 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@radix-ui/react-select";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";



const Layout = () => { 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="">
            <SidebarTrigger /> 
            <Separator />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Building Your AI Agent</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ask any</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div> 
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>

  ) 
}


export default Layout;
