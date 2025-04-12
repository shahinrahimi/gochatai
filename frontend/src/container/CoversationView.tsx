import React from "react";
import { Conversation, Message } from "@/api/types";
import MarkdownWithCode from "@/components/custom/MarkdownWithCode";
type CoversationViewProps = {
  c:Conversation 
}

type MessageViewProps = {
  m: Message
}

const MessageView = ({m}:MessageViewProps) => {
  const date = new Date(m.created_at)
  const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

  
  if (m.role === "user") {
    return (
      <li className={`flex-col px-2 pb-1 pt-0.5 border-1 border-gray-100 rounded-sm self-end bg-cyan-600 text-white`}>
        <p className="text-xs text-gray-300 mb-1">{m.creator} ~ {dateString}</p>
        <p>{m.content}</p>
      </li>
    )
  } else {
    return (
      <li className={`flex-col px-2 pb-1 pt-0.5 border-1 border-gray-300 rounded-sm self-center`}>
        <p className="text-xs text-gray-400 mb-1">{m.creator} ~ {dateString}</p>
        <MarkdownWithCode text={m.content} />
      </li>
    )
  }
}

const ConversationView = ({c}:CoversationViewProps) => {
 return (
   <ol className="my-4 flex flex-col h-fit min-h-full gap-8">
      {c.messages.map((message:Message, index) => <MessageView key={index} m={message} />)}
    </ol>

 ) 
}


export default ConversationView;
