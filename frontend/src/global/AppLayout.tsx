import {Outlet} from 'react-router-dom'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from './AppSidebar'; 

const AppLayout = () => { 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='max-w-full'>
          <Outlet />
      </SidebarInset>
    </SidebarProvider>

  ) 
}

export default AppLayout;