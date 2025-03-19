package main

// const (
//   OllamaBaseUrl = "http://host.docker.internal:11434" // access localhost:11434 in docker
// )
//
// // Generate a completion
// // POST => /api/generete
// type OllamaGenerateRequestPayload struct {
//   Model string `json:"model"`    
//   Prompt string `json:"prompt"`   
//   Stream bool `json:"stream"` 
//   Suffix string `json:"suffix,omitempty"`
//   Image []string `json:"image,omitempty"` 
//   Format string `json:"format,omitempty"` 
//   System string `json:"system,omitempty"` // 
//   Raw bool `json:"raw,omitempty"` // default false
//   Options OllamaGenerateRequestOptions `json:"options,omitempty"`
//   KeepAlive string `json:"keep_alive,omitempty"` // default 5m 
// }
//
// type OllamaGenerateRequestOptions struct {
//   Seed int64 `json:"seed,emitempty"`
//   Temperature float64 `json:"temperature,omitempty"`
//   NumCtx int `json:"num_ctx,omitempty"` // Sets the size of the context window used to generate the next token default 2048
// }
//
// type OllamaGenerateResponsePayload struct {
//   Model string `json:"model"`
//   Response string `json:"response"`
//   Done bool `json:"done"` 
//   PromptEvalCount int64  `json:"prompt_eval_count"`
//   PromptEvalDuration int64 `json:"prompt_eval_duration"`
//   EvalCount int64 `json:"eval_count"`
//   EvalDuration int64 `json:"eval_duration"`
//   TotalDuration int64 `json:"total_duration"`
//   LoadDuration int64 `json:"load_duration"`
// }
//
// // Generate a chat
// // POST => /api/chat
// type OllamaGenerateChatRequest struct {
//   Model string `json:"model"`
//   Messages []OllamaMessageChat `json:"messages"`
//   Tools []string `json:"tools"` 
//   Format string `json:"format"`
//   Stream bool  `json:"stream"`
//   KeepAlive string `json:"keep_alive"`
// }
//
// type OllamaMessageChat struct {
//   Role string `json:"role"`
//   Content string `json:"content"`
//   Image []string `json:"image"`
//   ToolCalls []string `json:"tool_calls"`
// }
//
//
// // List Models
// // GET => /api/models
// type OllamaModelDetails struct {
//   Format string `json:"format"`
//   Family string `json:"family"`
//   Families *string `json:"famieies"` // handle null references
//   ParamaterSize string `json:"paramater_size"`
//   QuantizationLevel string `json:"quantization_level"`
// }
// type OllamaModelInfo struct {
//   Name string `json:"name"`
//   ModifiedAt string `json:"modified_at"`
//   Size int64 `json:"size"`
//   Digest string `json:"digest"` 
//   Details OllamaModelDetails `json:"details"`
// }
// type OllamaListModelsResponsePayload struct {
//   Models []OllamaModelInfo `json:"models"`
// }
//
//
//
//
//
