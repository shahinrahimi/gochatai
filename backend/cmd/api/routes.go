package main

import (
	"backend/internal/handlers"
  "backend/internal/middlewares"

	"github.com/gofiber/fiber/v2"
)


func SetupRoutes(app *fiber.App) {
  // register global middlewares
  app.Use(middlewares.Logger)

  // main route - api
  api := app.Group("/api")
  
  // health-check hander
  api.Get("/ping",handlers.Ping)
  // hellow ollama handler
  api.Get("/hello",handlers.HelloOllama)
}
