import {apiStreem} from './api'
import { 
  ApiEndpoints, 
  GenerateCompletionReq,
  GenerateChatCompletionReq,
} from './types' 

export async function fetchGenereateStream (
  requestPayload: GenerateCompletionReq,
  onSuccess: (text: string) => void, 
  onError: (error:any) => void
) {
  const url = ApiEndpoints.GENERATE_STREAM
  return apiStreem(
    url,
    "POST",
    undefined,
    requestPayload,
    (chunk) => {      
      const jsonObject = chunk.trim().split("\n");
      jsonObject.forEach((element) => {
        try {
          const data = JSON.parse(element);
          if (data.response) {
            const text = data.response;
            if (!text.includes("<think>") && !text.includes("</think>")) {
              onSuccess(text);
            }   
          }
        } catch (error) {
          console.error("Failed to parse JSON error:", error);
          onError(error);
        }
      })
    },
    onError
  ) 
 }

export async function fetchGenereateChatStream (
  requestPayload: GenerateChatCompletionReq,
  onSuccess: (text: string) => void, 
  onError: (error:any) => void
) {
  const url = ApiEndpoints.GENERATE_CHAT_STREAM
  return apiStreem(
    url,
    "POST",
    undefined,
    requestPayload,
    (chunk) => {
      const jsonObject = chunk.trim().split("\n");
      jsonObject.forEach((element) => {
        try {
          const data = JSON.parse(element);
          if (data.response) {
            const text = data.response;
            if (!text.includes("<think>") && !text.includes("</think>")) {
              onSuccess(text);
            }
          }
        } catch (error) {
          console.error("Failed to parse JSON error:", error);
          onError(error);
        }
      })
    },
    onError
  ) 
 }
