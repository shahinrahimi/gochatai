import { Model } from '../types/'
const API_BASE_URL = "http://localhost:8000"
const API_LIST_MODELS = API_BASE_URL + "/list"
const API_GENERATE_ONCE = API_BASE_URL + "/generate"
const API_GENERATE_CHAT_ONCE = API_BASE_URL + "/generatechat"
const API_GENERATE_STREAM = API_BASE_URL + "/generatestream"
const API_GENERATE_CHAT_STREAM = API_BASE_URL + "/generatechatstream"

type GenerateComplitionOptionRequest = {
  seed: number
  temperature: number
  num_ctx?: number
}

export type GenerateComplitionRequest = {
  model: string; // modelName
  prompt: string;
  stream?: boolean;
  suffix?: string;
  image?: string[];
  format?: string;
  system?: string;
  raw?: boolean;
  options?: GenerateComplitionOptionRequest | undefined;
  keep_alive?: string | undefined // default 5m 
}

export const fetchModels = async (onSuccess: (modles: Model[]) => void, onError: (err: any) => void) => {
  try {
    const url = API_LIST_MODELS
    const res = await fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
        
    // check is response is ok
    if (!res.ok) throw new Error(`Error fetching models: ${res.statusText}`)
    try {
      
      const data = await res.json()
      console.log(`response from ${url}\ndata:`, data)
      const dataModels = data.data.models as Model[]
      onSuccess(dataModels)

    } catch (error) {
      console.log("Error parsing data to models: ", error)
    }
    
  } catch (error) {
    console.error("Error fetching models:", error)
    onError(error)
    return []
  }
}

export const fetchReplyOnce = async (requestPayload: GenerateComplitionRequest, onSuccess: (message: string) => void, onError: (error:any) => void) => {
  try {
    const url = API_GENERATE_ONCE 
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(requestPayload)
    })

    // check if response is ok
    if (!res.ok) throw new Error(`Error fetching reply: ${res.statusText}`)
    
    const data = await res.json()
    console.log(`response from ${url}\ndata:`, data)
    const dataMessage = data.data.response
    onSuccess(dataMessage)
    
  } catch (error) {
    console.error("Error fetching reply: ", error)
    onError(error)
    return ""
  }
}

export const fetchReplyStream = async (requestPayload: GenerateComplitionRequest ,onSuccess: (text: string) => void, onError: (error:any) => void) => {
  const url = API_GENERATE_STREAM
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(requestPayload)
    })

    const reader = res.body?.getReader()
    if (!reader) throw new Error("Failed to get reader from response body")
    const decoder = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      if (doneReading) break
      const chunk = decoder.decode(value, { stream: true })
      const jsonObject = chunk.trim().split("\n")
      jsonObject.forEach((element) => {
        try {
          const data = JSON.parse(element)
          if (data.response) {
            const text = data.response
            if (text.includes("<think>") || text.includes("</think>")) {
              // Do nothign
            } else {
              onSuccess(text);
            }
          }
        } catch (error) {
          console.error("Failed to parse JSON error: ", error)
          onError(error)
        }
      })
    }
  } catch (error) {
    console.error("Failed to fetching stram: ", error)
    onError(error)
  }
}
export const fetchChatStream = async (requestPayload: GenerateComplitionRequest ,onSuccess: (text: string) => void, onError: (error:any) => void) => {
  const url = API_GENERATE_STREAM
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(requestPayload)
    })

    const reader = res.body?.getReader()
    if (!reader) throw new Error("Failed to get reader from response body")
    const decoder = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      if (doneReading) break
      const chunk = decoder.decode(value, { stream: true })
      const jsonObject = chunk.trim().split("\n")
      jsonObject.forEach((element) => {
        try {
          const data = JSON.parse(element)
          if (data.response) {
            const text = data.response
            if (text.includes("<think>") || text.includes("</think>")) {
              // Do nothign
            } else {
              onSuccess(text);
            }
          }
        } catch (error) {
          console.error("Failed to parse JSON error: ", error)
          onError(error)
        }
      })
    }
  } catch (error) {
    console.error("Failed to fetching stram: ", error)
    onError(error)
  }
}

