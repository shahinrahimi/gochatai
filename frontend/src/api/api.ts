const API_BASE_URL = "http://localhost:8000"

const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
})

export async function api<T>(
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


export async function apiStreem(
  endpoint: string,
  method: "GET" | "POST",
  options: RequestInit = {},
  body?:any,
  onChunk?:(chunk: string) => void,
  onError?: (error:any) => void
):Promise<void> {
  const url = API_BASE_URL + endpoint
  try{
    const response = await fetch(url, {
      method,
      headers: {
        ...options.headers,
        ...getHeaders()
      },
      body: body ? JSON.stringify(body): undefined
    })

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Failed to get reader from response body")

      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading} = await reader.read();
        if (doneReading) break;
        const chunk = decoder.decode(value, { stream: true });
        if (onChunk) onChunk(chunk)
      }
  }catch(error){
    console.error("Streaming API Error: ", error);
    if (onError) onError(error)
  }
}
