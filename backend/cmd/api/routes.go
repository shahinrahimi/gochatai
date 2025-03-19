package main

import (
	"backend/internal/middlewares"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func (app *Application) rotues() http.Handler{
  mux := chi.NewRouter()

  mux.Use(cors.Handler(cors.Options{
    AllowedOrigins: []string{"http://localhost:5173"},
    AllowedMethods: []string{http.MethodGet, http.MethodPost},
    AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
  }))
  
  // register global middlwares
  mux.Use(middlewares.Logger)
  
  mux.Use(middlewares.HearBeat("/ping"))
  
  mux.Post("/generate", MakeHandlerFunc(app.GenerateCompletion))
  
  mux.Post("/generate-stream", MakeHandlerFunc(app.GenerateCompletionSSE))

  mux.Post("/chat", MakeHandlerFunc(app.GenerateChatCompletion))

  mux.Post("/chat-stream", MakeHandlerFunc(app.GenerateChatCompletionSSE))
  
  mux.Get("/list", MakeHandlerFunc(app.ListLocalModels))

  mux.Get("/list-running", MakeHandlerFunc(app.ListRunningModels))

  return mux


}
type CustomeHandler func(w http.ResponseWriter, r*http.Request) error

func MakeHandlerFunc(f CustomeHandler) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    if err := f(w,r); err != nil {
      logger.Printf("error %v", err)
    }
  }
}

