package main 

import (
	"fmt"
	"net/http"
)

const (
  OllamaBaseUrl = "http://host.docker.internal:11434" // access localhost:11434 in docker
)

// Generate a completion
// POST => /api/generete
type OllamaGenerateRequestPayload struct {
  Model string `json:"model"`    
  Prompt string `json:"prompt"`   
  Stream bool `json:"stream"` 
}

type OllamaGenerateResponsePayload struct {
  Model string `json:"model"`
  Response string `json:"response"`
  Done bool `json:"done"` 
  PromptEvalCount int64  `json:"prompt_eval_count"`
  PromptEvalDuration int64 `json:"prompt_eval_duration"`
  EvalCount int64 `json:"eval_count"`
  EvalDuration int64 `json:"eval_duration"`
  TotalDuration int64 `json:"total_duration"`
  LoadDuration int64 `json:"load_duration"`
}

func Generate(w http.ResponseWriter, r*http.Request) error {

  // parse requeset to struct
  var or OllamaGenerateRequestPayload 
  if err := ReadJSON(w,r,&or); err != nil {
    return ErrorJSON(w, err)
  }

  // temp: make sure it is not streamed!
  or.Stream = false

  // create a request 
  requestURL := fmt.Sprintf("%s%s", OllamaBaseUrl, "/api/generate")
  var orp OllamaGenerateResponsePayload
  if err := MakeAPIRequest(http.MethodPost, requestURL, or, &orp); err != nil {
    return ErrorJSON(w, err)
  }

  return WriteJSON(w, http.StatusOK, &jsonResponse{
    Error: false,
    Message: "successfully response generated",
    Data: orp,
  })
}


