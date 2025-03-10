package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

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

func ListModels(w http.ResponseWriter, r*http.Request) error {
  // create http object
  urlRequest := fmt.Sprintf("%s:%s", OllamaBaseUrl, "/api/tags")
  req, err := http.NewRequest(http.MethodGet, urlRequest, nil)
  if err != nil {
    return ErrorJSON(w, err)
  }

  req.Header.Set("Content-Type", "application/json")

  // create http client
  cl := http.Client{}
  resp, err := cl.Do(req)
  if err != nil {
    return ErrorJSON(w, err)
  }
  defer resp.Body.Close()

  body, err := io.ReadAll(resp.Body)
  if err != nil {
    return ErrorJSON(w, err)
  }
  
  var ol OllamaListModelsResponsePayload
  if err := json.Unmarshal(body, &ol); err != nil {
    return ErrorJSON(w, err)
  }

  return WriteJSON(w, http.StatusOK, &jsonResponse{
    Error: false,
    Message: "successfuly query model list",
    Data: ol,
  })
}


