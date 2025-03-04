package main

import (
	"backend/internal/utils"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

const (
	port = 5000
)

var logger = utils.GetLogger()
var dbURL = os.Getenv("DB_URL")


func main() {

	// check if dbURL is not empty 
	if dbURL == "" {
		logger.Fatal("DB_URL not found in env variables!")
	}

	// try connect to DB
	conn := connectToDB(dbURL)
	if conn == nil {
		logger.Fatal("The connection to DB is nil")
	}

	// create fibre app
	app := fiber.New()

  // setup routes
  SetupRoutes(app)

	// start server and listen
	logger.Printf("Starting server on port: %d", port)
	listenAddr := fmt.Sprintf(":%d", port)
	logger.Fatal(app.Listen(listenAddr))
}
