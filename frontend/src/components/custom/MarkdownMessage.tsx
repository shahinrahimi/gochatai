
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
interface MDMessageInterface {
  text: string
}
export const MarkdownMessage = ({ text }:MDMessageInterface) => {
  const mycustomText = (s:string) => "# Hi Raptor\n" + s 
  return (
    <div className="p-3 border-b">
      <Markdown children={mycustomText(text)} remarkPlugins={[remarkGfm]}  />
    </div>
  )
}

export const MarkdownWithCode = ({ text }: {text: string}) => {
  return (
    <Markdown
      children={text}
      components={{
      code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <SyntaxHighlighter
            {...(rest as any)} // Fix ref issue by casting props
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dark}
          />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      }
    }}
  />
  )
}

export default MarkdownMessage
