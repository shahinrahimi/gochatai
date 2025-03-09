
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface MDMessageInterface {
  text: string
}
const MarkdownMessage = ({ text }:MDMessageInterface) => {
  const mycustomText = (s:string) => "# Hi Raptor\n" + s 
  return (
    <div className="p-3 border-b">
      <Markdown children={mycustomText(text)} remarkPlugins={[remarkGfm]}  />
    </div>
  )
}


export default MarkdownMessage
