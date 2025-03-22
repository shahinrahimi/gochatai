

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
          <div 
            style={{
              margin: "24px 0", 
              padding: "8px"
            }}>
            <div 
              style={{
                borderTop: "2px solid #ccc",
                borderLeft: "2px solid #ccc",
                borderRight: "2px solid #ccc",
                display: "flex",
                padding:"8px 16px", 
                backgroundColor:"#777", 
                marginBottom:"0", 
                fontWeight: "bold", 
                color: "#fff",
                borderTopRightRadius: "8px",
                borderTopLeftRadius: "8px"
            }}>
              {`~ ${match[1].toUpperCase()}`} 
            </div>
            <SyntaxHighlighter
              {...(rest as any)} // Fix ref issue by casting props
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={atomDark}
              customStyle={{
                borderBottom: "2px solid #ccc",
                borderLeft: "2px solid #ccc",
                borderRight: "2px solid #ccc",
                margin: 0,
                padding: "16px",
                borderTopRightRadius: "0",
                borderTopLeftRadius: "0",
                borderRadius: "6px",
              }}
            />

          </div>
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
