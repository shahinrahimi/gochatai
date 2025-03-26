import apiClient from './api';
import { 
  ApiEndpoints, 
  GenerateCompletionReq,
  GenerateCompletionRes,
  GenerateChatCompletionReq,
  GenerateChatCompletionRes,
} from './types' 

export async function fetchGenerateCompletionStream (
  requestPayload: GenerateCompletionReq,
  onSuccess: (resp: GenerateCompletionRes) => void, 
  onError: (error:any) => void
) {
  const url = ApiEndpoints.GENERATE_STREAM
  return apiClient.requestStream(
    url,
    "POST",
    undefined,
    requestPayload,
    (chunk) => {      
      try {
        const trimmedChunk = chunk.trim();

        // If the chink is empty or malformed, return early to avoid infinit
        if (!trimmedChunk) {
          return;
        }

        const jsonObject = trimmedChunk.split("\n");
        jsonObject.forEach(element => {
          try {
            const data = JSON.parse(element)
            
            if (data) {
              onSuccess(data)
            } else {
              throw new Error("failed to parse element")
            }

          } catch (parseError) {
            console.warn("Skipping malformed JSON chunk: ", parseError ,element)
            return
          }
        })
    } catch (error) {
        console.error("Failed to process the chunk: ", error)
        onError(error)
    }
      //const jsonObject = chunk.trim().split("\n");
      //jsonObject.forEach((element) => {
      //  try {
      //    const data = JSON.parse(element);
      //    if (data.response) {
      //      const text = data.response;
      //      if (!text.includes("<think>") && !text.includes("</think>")) {
      //        onSuccess(text);
      //      }   
      //    }
      //  } catch (error) {
      //    console.error("Failed to parse JSON error:", error);
      //    onError(error);
      //  }
      //})
    },
    onError
  ) 
 }

export async function fetchGenerateChatStream (
  requestPayload: GenerateChatCompletionReq,
  onSuccess: (res: GenerateChatCompletionRes) => void, 
  onError: (error:any) => void
) {
  const url = ApiEndpoints.GENERATE_CHAT_STREAM
  return apiClient.requestStream(
    url,
    "POST",
    undefined,
    requestPayload,
    (chunk) => {
      try {
        const trimmedChunk = chunk.trim();

        // If the chink is empty or malformed, return early to avoid infinit
        if (!trimmedChunk) {
          return;
        }

        const jsonObject = trimmedChunk.split("\n");
        jsonObject.forEach(element => {
          try {
            const data = JSON.parse(element)
            
            if (data.done) {
              return;
            }

            if (data) {
              onSuccess(data)
            } else {
              throw new Error("failed to parse element")
            }

          } catch (parseError) {
            console.warn("Skipping malformed JSON chunk: ", parseError ,element)
            return
          }
        })
      } catch (error) {
        console.error("Failed to process the chunk: ", error)
        onError(error)
      }
    },
    onError
  ) 
 }
