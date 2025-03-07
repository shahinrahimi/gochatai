package middlewares

import (
	"net/http"
	"strings"
)

func HearBeat(endpoint string) func (http.Handler) http.Handler{
  return func (next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      if (r.Method == http.MethodGet || r.Method == http.MethodHead) && strings.EqualFold(r.URL.Path, endpoint) {
        w.Header().Set("Content-Type", "text/plain")  
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("."))
        return
      }
      next.ServeHTTP(w,r)
    })
  }
}
