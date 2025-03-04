
package middlewares

import (
	"backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)


func Logger(c *fiber.Ctx) error {
  // get global singleton logger
  logger := utils.GetLogger()
  logger.Info("Request received", logrus.Fields{
    "method": c.Method(),
    "path": c.Path(),
  })

  return c.Next()
}
