

import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

export const MarkdownWithCode = ({ text }: {text: string}) => {
  return (
    <Markdown
    remarkPlugins={[remarkGfm]}
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
            style={atomDark}
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

export default MarkdownWithCode;
