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
 return (
    <SidebarMenuItem >
      <SidebarMenuButton 
        className={`flex justify-between items-center ${isActive ? "bg-cyan-200/50 font-semibold" : ""}`}
      >
      <Link to={`/${root}/${c.id}`}>{c.title}</Link>
      {c.messages.length > 0 ? (
        <span
          role="button"
          onClick={() => onDelete(c.id)}
          className="ml-2 p-1 rounded hover:bg-red-100"
        >
        <Delete className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </span>
      ):null}
      </SidebarMenuButton>
    </SidebarMenuItem>

 ) 
}



export default SidebarConversationItem;
