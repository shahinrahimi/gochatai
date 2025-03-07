package main

import (
	"backend/internal/utils"
	"fmt"
	"os"
"net/http"
)

const (
	port = 5000
)

type Application struct{}

var logger = utils.GetLogger()
var dbURL = os.Getenv("DB_URL")


func main() {
  app := &Application{}

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
