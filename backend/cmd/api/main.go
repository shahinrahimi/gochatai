package main

import (
	"backend/internal/utils"
	"fmt"
	"net/http"
	"os"

	"github.com/shahinrahimi/ollamalite/ollama"
)

const (
	port = 5000
)

type Application struct{
  oc *ollama.Client
}

func NewApplication(ollamaBaseUrl string) *Application{
  return &Application{ollama.NewClient(ollamaBaseUrl)}
}

var logger = utils.GetLogger()
var dbURL = os.Getenv("DB_URL")


func main() {
  app := NewApplication("http://host.docker.internal:11434")

	// check if dbURL is not empty 
	if dbURL == "" {
		logger.Fatal("DB_URL not found in env variables!")
	}

	// try connect to DB
	if conn := app.connectToDB(dbURL); conn == nil {
		logger.Fatal("The connection to DB is nil")
  }

  srv := &http.Server{
    Addr: fmt.Sprintf(":%d", port),
    Handler: app.rotues(),
  }

  logger.Printf("Starting gochatai backend service on port %d\n", port)
  if err := srv.ListenAndServe(); err != nil {
    logger.Fatal(err)
  }

}
