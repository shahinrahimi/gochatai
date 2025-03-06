package main

import (
	"backend/internal/handlers"
  "backend/internal/middlewares"

	"github.com/gofiber/fiber/v2"
  "github.com/gofiber/fiber/v2/middleware/cors"
)


func SetupRoutes(app *fiber.App) {
  app.Use(cors.New(cors.Config{
    AllowOrigins: "http://localhost:5173",
  }))
  // register global middlewares
  app.Use(middlewares.Logger)

  // main route - api
  api := app.Group("/api")
  
  // health-check hander
  api.Get("/ping",handlers.Ping)
  // hellow ollama handler
  api.Get("/hello",handlers.HelloOllama)
}
