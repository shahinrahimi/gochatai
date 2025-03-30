import {Outlet} from 'react-router-dom'
import AppSidebar from "@/components/custom/AppSidebar" 
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => { 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
          <Outlet />
      </SidebarInset>
    </SidebarProvider>

  ) 
}


export default Layout;
