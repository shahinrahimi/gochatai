import React from "react"
import { Message, GenerateCompletionReq } from "@/api/types"
import { fetchGenerateCompletionStream } from "@/api/generate-stream"
export function useCompletion(reqPayload: GenerateCompletionReq){  
   const [messages, setMessages] = React.useState<Message[]>([])
   const [req, setReq] = React.useState<GenerateCompletionReq>(reqPayload)
   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   const handleSubmit = (e:any) => {
    e.preventDefault()
    if (!req) {
      console.log("the req can not be undefined")
      return
    }
    if (req.prompt.trim() == "") {
      console.log("the prompt can't be empty string")
      return
    }

    if (!req.model){
      console.log("useCompletion: the model can not be empty")
      return 
    }

    // add prompt to messages with role user
    const m:Message = {
      content: req.prompt,
      role: "user",
    }
    // feaure reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
    }

    
    // Update messages state immediatly
    setMessages((prevMessages) => [...prevMessages, m, featuredMessage])

    setIsLoading(true)
   
    fetchGenerateCompletionStream(
      req,
      (resp) => {
        setMessages(prevMessages => {
          return prevMessages.map((em,index) => {
            if (index == prevMessages.length - 1) {
              return {...em, content: em.content + resp.response}
            }
            return em
          })
        })
        if (resp.done) setIsLoading(false)
      },
      (err) => console.log(err)
    )  
  
   }


   return {
     messages,
     setReq,
     handleSubmit,
     isLoading
   }
}
