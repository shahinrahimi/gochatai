
import React from "react";
import MarkdownWithCode from "@/components/custom/MarkdownWithCode";
import { Message } from "../api/types" 

const MessageList = ({messages}:{messages:Message[]}) => {
  return (
    <ol>
      {messages.map((message:Message, index) => {
        if (message.role == "user") {
          return(
            <li className="bg-cyan-700 text-white" key={index}>{message.content}</li>
          )
        } else {
          return(
            <li key={index}><MarkdownWithCode text={message.content}/></li>
          )
        }
      })}
    </ol>
  )
}

export default MessageList;
