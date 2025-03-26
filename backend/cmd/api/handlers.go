package main

import (
	"context"
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




