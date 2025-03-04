package middlwares

import (
	"backend/internal/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)


func LoggerMiddleware(c *fiber.Ctx) error {
  // get global singleton logger
  logger := utils.GetLogger()
  logger.Info("Request received", logrus.Fields{
    "method": c.Method(),
    "path": c.Path(),
  })

  fmt.Println("Hi this is logger middleware")

  return c.Next()
}
