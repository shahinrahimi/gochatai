package middlewares

import (
	"backend/internal/utils"
	"net/http"

	"github.com/sirupsen/logrus"
)

func Logger(next http.Handler) http.Handler {
  logger := utils.GetLogger()
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    logger.Info("Request received", logrus.Fields{
      "Method": r.Method,
      "URL": r.URL,
     "RemoteAddr": r.RemoteAddr,
    })
    next.ServeHTTP(w,r)
  })
}

