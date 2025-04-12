import React from "react";
import { 
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"; 
import { Link } from "react-router-dom";
import { Delete } from "lucide-react";
import { Conversation } from "@/api/types";

type SidebarConversationItemProps = {
  c: Conversation
  root: string
  isActive: boolean;
  onDelete: (id:string) => void
}

const SidebarConversationItem = ({root, c, isActive, onDelete}: SidebarConversationItemProps) => {
  
  const croppedTitle = c.title.length > 26 ? c.title.slice(0, 23) + '...' : c.title;
 return (
    <SidebarMenuItem >
      <SidebarMenuButton 
        className={`flex justify-between items-center w-full ${isActive ? "bg-cyan-200/50 font-semibold" : ""}`}
      >
      <Link 
        className="text-nowrap flex-10/12" 
        to={`/${root}/${c.id}`}
        title={c.title}
      >
      {croppedTitle}
      </Link>
      {c.messages.length > 0 ? (
        <span
          role="button"
          onClick={() => onDelete(c.id)}
          className="ml-2 flex-1/12 p-1 rounded justify-center items-center"
        >
        <Delete className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </span>
      ):null}
      </SidebarMenuButton>
    </SidebarMenuItem>

 ) 
}



export default SidebarConversationItem;
