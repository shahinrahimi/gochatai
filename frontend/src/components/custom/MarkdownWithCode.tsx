

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
        const codeText = String(children).replace(/\n$/, "")
        const [copied, setCopied] = React.useState(false)
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(codeText)
            setCopied(true)
            setTimeout(() => setCopied(false), 1000)
          } catch (err){
            console.error("Failed to copy!", err)
          }
        }
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
                justifyContent: "space-between",
                alignItems: "center",
                padding:"8px 16px", 
                backgroundColor:"#777", 
                marginBottom:"0", 
                fontWeight: "bold", 
                color: "#fff",
                borderTopRightRadius: "8px",
                borderTopLeftRadius: "8px"
            }}>
              <span>{`~ ${match[1].toUpperCase()}`}</span>
              <button
                onClick={handleCopy}
                 style={{
                    backgroundColor: copied ? "#4caf50" : "#555",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
              >
              {copied ? "Copied": "Copy"}
              </button>
              
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
