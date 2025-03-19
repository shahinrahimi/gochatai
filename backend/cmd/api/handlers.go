package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/shahinrahimi/ollamalite/ollama"
)

func(app *Application) GenerateCompletion(w http.ResponseWriter, r*http.Request) error {
  // parse requeset to struct
  var oReq ollama.GenerateCompletionReq 
  if err := ReadJSON(w,r,&oReq); err != nil {
    return ErrorJSON(w, err)
  }

  // make sure it is not streamed!
  oReq.Stream = false
  
  oRes, err := app.oc.GenerateCompletion(context.TODO(), oReq);
  if err != nil {
    return ErrorJSON(w, err);
  }

  return WriteJSON(w, http.StatusOK, &jsonResponse{
    Error: false,
    Message: "successfully response generated",
    Data: oRes,
  })
}

func (app *Application)GenerateChatCompletion(w http.ResponseWriter, r*http.Request) error {
  var or ollama.GenerateChatCompletionReq
  if err := ReadJSON(w, r, &or); err != nil {
    return ErrorJSON(w, err)
  }

  oRes, err := app.oc.GenerateChatCompletion(context.TODO(), or)
  if err != nil {
    return ErrorJSON(w, err)
  }

  return WriteJSON(w, http.StatusOK, &jsonResponse{
    Error: false,
    Message: "successully response chat generated!",
    Data: oRes,
  })
}

func (app *Application) GenerateCompletionSSE (w http.ResponseWriter, r*http.Request) error {
  ctx := r.Context()
  w.Header().Set("Content-Type", "json/application")
  w.Header().Set("Cashe-Control", "no-cache")
  w.Header().Set("Connection", "keep-alive")
  w.Header().Set("Transfer-Encoding", "chunked")
  flusher, ok := w.(http.Flusher)
  if !ok{
    return ErrorJSON(w, errors.New("flusher is not ok!"))
  }
  var oReq ollama.GenerateCompletionReq
  if err := ReadJSON(w, r, &oReq); err != nil {
    return ErrorJSON(w,err)
  }

  outCh, errCh := app.oc.GenerateCompletionSSE(ctx, oReq)
  for {
    select {
    case chunk, _ := <-outCh:
      data, _ := json.Marshal(chunk)
      fmt.Fprintln(w, string(data))
      flusher.Flush()
    
    case err, _ := <-errCh:
      return ErrorJSON(w, fmt.Errorf("Streaming error: %w", err))
    }
  }


}
func (app *Application) GenerateChatCompletionSSE (w http.ResponseWriter, r*http.Request) error {
  ctx := r.Context()
  w.Header().Set("Content-Type", "json/application")
  w.Header().Set("Cashe-Control", "no-cache")
  w.Header().Set("Connection", "keep-alive")
  w.Header().Set("Transfer-Encoding", "chunked")
  flusher, ok := w.(http.Flusher)
  if !ok{
    return ErrorJSON(w, errors.New("flusher is not ok!"))
  }
  var oReq ollama.GenerateChatCompletionReq
  if err := ReadJSON(w, r, &oReq); err != nil {
    return ErrorJSON(w,err)
  }

  outCh, errCh := app.oc.GenerateChatCompletionSSE(ctx, oReq)
  for {
    select {
    case chunk, _ := <-outCh:
      data, _ := json.Marshal(chunk)
      fmt.Fprintln(w, string(data))
      flusher.Flush()
    
    case err, _ := <-errCh:
      return ErrorJSON(w, fmt.Errorf("Streaming error: %w", err))
    }
  }


}


func(app *Application) ListLocalModels(w http.ResponseWriter, r*http.Request) error {
  resp, err := app.oc.ListLocalModels(context.TODO())
  if err != nil {
    return ErrorJSON(w, err)
  }

  return WriteJSON(w, http.StatusOK, &jsonResponse{
    Error: false,
    Message: "successfully query local models",
    Data: resp,
  })  
}
func(app *Application) ListRunningModels(w http.ResponseWriter, r*http.Request) error {
  resp, err := app.oc.ListRunningModels(context.TODO())
  if err != nil {
    return ErrorJSON(w, err)
  }

  return WriteJSON(w, http.StatusOK, &jsonResponse{
    Error: false,
    Message: "successfully query running models",
    Data: resp,
  })  
}




