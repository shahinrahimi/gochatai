package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

const (
	port = 5000
)

func main() {
	// create a custom logger
	logger := log.New(os.Stdout, "[GOCHATAI-API] ", log.Ldate|log.Ltime|log.Lshortfile)

	// load DB_URL from env
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		logger.Fatal("DB_URL not found in env variables!")
	}
  // create config for connection to DB
  cfg := NewConfig(dbURL, logger)

	// try connect to DB
	conn := cfg.connectToDB()
	if conn == nil {
		logger.Fatal("The connection to DB is nil")
	}

	// create fibre app
	app := fiber.New()

	// simple route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello, world")
	})

	// start server and listen
	logger.Printf("Starting server on port: %d", port)
	listenAddr := fmt.Sprintf(":%d", port)
	logger.Fatal(app.Listen(listenAddr))
}
