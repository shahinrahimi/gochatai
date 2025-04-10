
import React from "react"
import { Message, GenerateChatReq, LocalModel } from "@/api/types"
import { fetchGenerateChatStream } from "@/api/generate-stream"
import { useConversation } from "@/context/ConversationContext"
export function useChat(model: LocalModel | null) {
    const {
      getCurrentConversation,
      createConversation,
      addMessageToCurrent,
      updateLastAssistantMessage,
    } = useConversation()
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
      created_at: Date.now(),
      updated_at: Date.now()
    }
    // feaure reply or Message
    const featuredMessage:Message = {
      content: "",
      role: "assistant",
      created_at: Date.now(),
      updated_at: Date.now()
    }
    
    // ceate request before updating state
    let conv = getCurrentConversation()
    if (!conv) {
      createConversation("New Chat");
      conv = getCurrentConversation()
    }
    const req: GenerateChatReq = {
      model:model.name,
      messages: [...(conv?.messages ?? []), m],
      stream: true,
    }

    addMessageToCurrent(m)
    addMessageToCurrent(featuredMessage)
    setInput("")
   
    fetchGenerateChatStream(
      req,
      (resp) => {
        updateLastAssistantMessage(resp.message.content)
        if (resp.done) setIsLoading(false)
      },
      (err) => {
        console.log(err)
        setIsLoading(false)
      }
    )  
  
   }


   return {
     messages: getCurrentConversation()?.messages ?? [],
     input,
     setInput,
     handleSubmit,
     isLoading
   }
}
