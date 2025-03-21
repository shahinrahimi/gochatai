import { Model } from '../types/'
const API_BASE_URL = "http://localhost:8000"
const ENDPOINT_LIST_LOCAL_MODELS = "/list"
const ENDPOINT_LIST_RUNNING_MODLES =  "/list-running"
const ENDPOINT_GENERATE = "/generate"
const ENDPOINT_GENERATE_CHAT = "/chat"
const ENDPOINT_GENERATE_STREAM = "/generate-stream"
const ENDPOINT_GENERATE_CHAT_STREAM = "/chat-stream"

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

const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
})

async function api<T>(
  endpoint: string,
  method: "GET" | "POST",
  options: RequestInit = {},
  body?: any,
  
  onSuccess?: (data: T) => void,
  onError?: (error: any) => void
):Promise<T | void> {
  const url = API_BASE_URL + endpoint  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...options.headers, // allow additional headers
        ...getHeaders(),
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: T = await response.json();
    console.log(`Response fron ${url}: `, data);

    if (onSuccess) onSuccess(data);
    return data;
  }catch(error){
    console.error("API Error: ", error);
    if (onError) onError(error);
  }
}

export async function fetchLocalModels(
  onSuccess: (models: Model[]) => void,
  onError: (err: any) => void
){
  return api<{data: { models: Model[]}}>(
    ENDPOINT_LIST_LOCAL_MODELS,
    "GET",
    undefined,
    undefined,
    (data) => onSuccess(data.data.models),
    (error) => onError(error),
  )
}
export async function fetchRunningModels(
  onSuccess: (models: Model[]) => void,
  onError: (err: any) => void
){
  return api<{data: { models: Model[]}}>(
    ENDPOINT_LIST_RUNNING_MODLES,
    "GET",
    undefined,
    undefined,
    (data) => onSuccess(data.data.models),
    (error) => onError(error),
  )
}

export async function fetchGenerate(
  payload: GenerateComplitionRequest,
  onSuccess: (message: string) => void,
  onError: (err: any) => void
){
  return api<{data: { response: string}}>(
    ENDPOINT_GENERATE,
    "POST",
    undefined,
    payload,
    (data) => onSuccess(data.data.response),
    (error) => onError(error),
  )
}
// TODO: change payload type
export async function fetchGenerateChat(
  payload: GenerateComplitionRequest,
  onSuccess: (message: string) => void,
  onError: (err: any) => void
){
  return api<{data: { response: string}}>(
    ENDPOINT_GENERATE_CHAT,
    "POST",
    undefined,
    payload,
    (data) => onSuccess(data.data.response),
    (error) => onError(error),
  )
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

