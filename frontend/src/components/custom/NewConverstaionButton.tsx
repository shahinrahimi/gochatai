import React from "react";
import { useNavigate } from "react-router-dom";
import {MessageSquarePlus} from "lucide-react"
import IconButton from "../IconButton";
const NewConversationButton = () => {
  const navigate = useNavigate()

  return (
    <IconButton onClick={() => navigate("/chat")}>
      <MessageSquarePlus />
    </IconButton>
  )
}


export default NewConversationButton; 
