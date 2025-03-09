import { Model } from '../types/'
const API_BASE_URL = "http://localhost:3000"
const API_LIST_MODELS = API_BASE_URL + "/list"
const API_GENERATE_ONCE = API_BASE_URL + "/generate"
const API_GENERATE_STREAM = API_BASE_URL + "/generatestream"

    

export const fetchModels = async (): Promise<Model[]> => {
  try {
    const url = API_LIST_MODELS
    const res = await fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
        
    // check is response is ok
    if (!res.ok) throw new Error(`Error fetching models: ${res.statusText}`)
    const data = await res.json()
    console.log(`response from ${url}\ndata:`, data)

    return data.data.models

  } catch (error) {
    console.error("Error fetching models:", error)
    return []
  }
}

export const fetchReplyOnce = async (modelName: string, prompt: string): Promise<string> => {
  try {
    const url = API_GENERATE_ONCE 
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: modelName,
        prompt: prompt
      })
    })

    // check if response is ok
    if (!res.ok) throw new Error(`Error fetching reply: ${res.statusText}`)
    
    const data = await res.json()
    console.log(`response from ${url}\ndata:`, data)
    
    return data.data.response
  } catch (error) {
    console.error("Error fetching reply: ", error)
    return ""
  }
}

export const fetchReplyStream = async (modelName: string, prompt: string, onResponse: (text: string) => void, onError: (error:any) => void) => {
  const url = API_GENERATE_STREAM
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: modelName,
        prompt: prompt
      })
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
            // Handling thinking state
            if (text.includes("<think>")) {
              //isThinking = true;
            } else if (text.includes("</think>")) {
              //isThinking = false;
            } else {
              onResponse(text);
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

