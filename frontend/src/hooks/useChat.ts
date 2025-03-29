
import React from "react"
import { Message, GenerateChatReq, LocalModel } from "@/api/types"
import { fetchGenerateChatStream } from "@/api/generate-stream"
export function useChat(model: LocalModel | null){  
   const [messages, setMessages] = React.useState<Message[]>([])
   const [input, setInput] = React.useState<string>("")
   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault()
    if (input.trim() == "") {
      console.log("the prompt can't be empty string")
      return
    }

    if (!model){
      console.log("useCompletion: the model can not be empty")
      return 
    }

    // add prompt to messages with role user
    const m:Message = {
      content: input,
      role: "user",
    }
    // feaure reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
    }
    
    // ceate requet before updating state
    const req: GenerateChatReq = {
      model:model.name,
      messages: [...messages, m],
      stream: true,
    }

    
    // Update messages state immediatly
    setMessages((prevMessages) => [...prevMessages,m,featuredMessage])

    setIsLoading(true)
   
    fetchGenerateChatStream(
      req,
      (resp) => {
        setMessages(prevMessages => {
          return prevMessages.map((em,index) => {
            if (index == prevMessages.length - 1) {
              return {...em, content: em.content + resp.message.content}
            }
            return em
          })
        })
        console.log(resp)
        if (resp.done) setIsLoading(false)
      },
      (err) => console.log(err)
    )  
  
   }


   return {
     messages,
     input,
     setInput,
     handleSubmit,
     isLoading
   }
}
