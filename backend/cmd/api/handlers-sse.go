
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/shahinrahimi/ollamalite/ollama"
)


func (app *Application) GenerateCompletionSSE (w http.ResponseWriter, r*http.Request) error {
  ctx := r.Context()
  w.Header().Set("Content-Type", "application/json")
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
    case chunk, ok := <-outCh:
      if !ok {
        return nil // Exit when output channel is closed
      }
      data, _ := json.Marshal(chunk)
      w.Write(data)
      w.Write([]byte("\n"))
      flusher.Flush()
    
    case err, ok := <-errCh:
      if !ok {
        return nil // Exit when error channel is closed
      }
      return ErrorJSON(w, fmt.Errorf("Streaming error: %w", err))
    case <- ctx.Done():
      return nil
    }
  }
}
func (app *Application) GenerateChatCompletionSSE (w http.ResponseWriter, r*http.Request) error {
  ctx := r.Context()
  w.Header().Set("Content-Type", "application/json")
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
    case chunk, ok := <-outCh:
      if !ok {
        return nil // Exit when output channel is closed
      }
      data, _ := json.Marshal(chunk)
      w.Write(data)
      w.Write([]byte("\n"))
      flusher.Flush()
    case err, ok := <-errCh:
      if !ok {
        return nil // Exit when err channel is closed
      }
      return ErrorJSON(w, fmt.Errorf("Streaming error: %w", err))
    case <- ctx.Done():
      return nil
    }
  }


}

