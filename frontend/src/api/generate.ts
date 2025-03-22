import { api } from "./api"
import {
  GenerateCompletionReq,
  GenerateChatCompletionReq,
  ApiEndpoints
} from "./types"

export async function fetchGenerate(
  payload: GenerateCompletionReq,
  onSuccess: (message: string) => void,
  onError: (err: any) => void
){
  return api<{data: { response: string}}>(
    ApiEndpoints.GENERATE,
    "POST",
    undefined,
    payload,
    (data) => onSuccess(data.data.response),
    (error) => onError(error),
  )
}

export async function fetchGenerateChat(
  payload: GenerateChatCompletionReq,
  onSuccess: (message: string) => void,
  onError: (err: any) => void
){
  return api<{data: { response: string}}>(
    ApiEndpoints.GENERATE_CHAT,
    "POST",
    undefined,
    payload,
    (data) => onSuccess(data.data.response),
    (error) => onError(error),
  )
}


