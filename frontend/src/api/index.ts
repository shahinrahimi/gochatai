import { Model } from '../types/'
const API_BASE_URL = "http://localhost:3000"
const API_LIST_MODELS = API_BASE_URL + "/list"
const API_GENERATE_ONCE = API_BASE_URL + "/generate"
//const API_GENERATE_STREAM = API_BASE_URL + "/generatestream"

    

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
