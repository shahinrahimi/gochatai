package utils

import (
	"os"
	"sync"

	"github.com/sirupsen/logrus"
)


var logger *logrus.Logger
var once sync.Once

func GetLogger() *logrus.Logger {
  once.Do(func() {
    logger = logrus.New()
    // set log format
    logger.SetFormatter(&logrus.JSONFormatter{})
    // set output to stdout
    logger.SetOutput(os.Stdout)
    // set log level
    logger.SetLevel(logrus.InfoLevel)
    // set flag
    logger.SetReportCaller(true)
  })

  return logger
}

