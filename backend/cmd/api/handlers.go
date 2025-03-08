package main

import (
	"bytes"
	"encoding/json"
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

func GenerateStreamEnabled(w http.ResponseWriter, r*http.Request) error {
  var or OllamaGenerateRequestPayload
  if err := ReadJSON(w, r, &or); err != nil {
    return ErrorJSON(w, err)
  }
  
  // temp: make sure it is streamed
  or.Stream = true

  // create http objest
  requestURL := fmt.Sprintf("%s:%s", OllamaBaseUrl, "/api/generate")
  jsonData, err := json.Marshal(or)
  if err != nil {
    return ErrorJSON(w, err)
  }
  req, err := http.NewRequest(http.MethodPost,requestURL,bytes.NewBuffer(jsonData))
  if err != nil {
    return ErrorJSON(w, err)
  }
  // set proper header
  req.Header.Set("Content-Type", "application/json")

  // creating the client
  cl := http.Client{}
  resp, err := cl.Do(req)
  if err != nil {
    return ErrorJSON(w, err)
  }
  defer resp.Body.Close()
  

  // set the necessary headers for streaming
  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Transfer-Encoding", "chunked")

  // stream data from ollama to the user
  buffer := make([]byte, 1024)
  for {
    n, err := resp.Body.Read(buffer)
    if err != nil {
      // TODO check end of stream - or simple error
      fmt.Printf("err in reading buffer of the body err: %v", err)
      break
    }

    // Write the chunk to the response
    if n > 0 {
      _, err := w.Write(buffer[:n])
      if err != nil {
        fmt.Printf("err in writing to response: %v", err)
        break
      }

      // Ensure that the chunk is sent immediately to the clinet
      // this is type assertion
      // http.ResponseWriter also implements the http.Flusher
      w.(http.Flusher).Flush()
    }
  }
  
 return nil 

}
