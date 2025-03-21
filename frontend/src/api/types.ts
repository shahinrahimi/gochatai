
export enum ApiEndpoints {
  LIST_LOCAL_MODELS = "/list",
  LIST_RUNNING_MODLES =  "/list-running",
  GENERATE = "/generate",
  GENERATE_CHAT = "/chat",
  GENERATE_STREAM = "/generate-stream",
  GENERATE_CHAT_STREAM = "/chat-stream",
}

// Define the Options type
export interface Options {
  seed?: number;
  temperature?: number;
  num_ctx?: number;
}

// Define GenerateCompletionReq
export interface GenerateCompletionReq {
  model: string;
  prompt: string;
  stream: boolean;
  suffix?: string;
  image?: string[];
  format?: string;
  system?: string;
  raw?: boolean;
  options?: Options;
  keep_alive?: string;
}

// Define GenerateCompletionRes
export interface GenerateCompletionRes {
  model: string;
  response: string;
  done: boolean;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
  total_duration: number;
  load_duration: number;
}

// Define Message type
export interface Message {
  role: string;
  content: string;
  image?: string[];
  tool_calls?: string[];
}

// Define GenerateChatCompletionReq
export interface GenerateChatCompletionReq {
  model: string;
  messages: Message[];
  tools: string[];
  format: string;
  stream: boolean;
  keep_alive: number;
}

// Define GenerateChatCompletionRes
export interface GenerateChatCompletionRes {
  model: string;
  created_at: string;
  message: Message;
  done: boolean;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
  total_duration: number;
  load_duration: number;
}

// Define LoadModelRes
export interface LoadModelRes {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

// Define UnloadModelRes
export interface UnloadModelRes {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason: string;
}

// Define RunningModel
export interface RunningModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Details;
  expire_at: string;
  size_vram: number;
}

// Define LocalModel
export interface LocalModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Details;
}

// Define Details
export interface Details {
  format: string;
  family: string;
  families?: string[]; // Handle nullable values
  parameter_size?: string;
  quantization_level?: string;
}

// Define ListRunningModelsRes
export interface ListRunningModelsRes {
  models: RunningModel[];
}

// Define ListLocalModelsRes
export interface ListLocalModelsRes {
  models: LocalModel[];
}

// Define CompletionSSERes
export interface CompletionSSERes {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason?: string;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// Define ChatCompletionSSERes
export interface ChatCompletionSSERes {
  model: string;
  created_at: string;
  done: boolean;
  message: Message;
  total_duration?: number;
  load_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}
