import React from "react";
import { useNavigate } from "react-router-dom";
import {MessageSquarePlus} from "lucide-react"

const NewConversationButton = () => {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate("/chat")}>
      <MessageSquarePlus />
    </button>
  )
}


export default NewConversationButton; 
