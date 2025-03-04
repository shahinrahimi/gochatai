package handlers

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func Ping(c *fiber.Ctx) error {
  return c.JSON(fiber.Map{"message": "pong"})
}

type RequestPayload struct {
  Model string `json:"model"`
  Prompt string `json:"prompt"`
}

type ResponsePayload struct {
  Response string `json:"response"`
}

type APIResponse struct {
  Error bool `json:"error"`
  Message string `json:"message,omitempty"`
  Data interface{} `json:"data,omitempty"`
}


func HelloOllama(c *fiber.Ctx) error {
  url := "http://host.docker.internal:11434/api/generate"
  payload := RequestPayload{
    Model: "deepseek-r1:1.5b",
    Prompt: "Explain quantom mechanics in simple term",
  }
  jsonData, err := json.Marshal(payload)
  if err != nil {
    response := APIResponse{
      Error: true,
      Message: "error in encoding json",
    }
    return c.Status(fiber.StatusInternalServerError).JSON(response)
  }

  req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(jsonData))
  if err != nil {
    response := APIResponse{
      Error: true,
      Message: "error creating a new requeset",
    }
    return c.Status(fiber.StatusInternalServerError).JSON(response)
  }

  cl := http.Client{}
  res, err := cl.Do(req)
  if err != nil {
    response := APIResponse{
      Error: true,
      Message: fmt.Sprintf("error getting response from ollama err: %v", err),
    }
    return c.Status(fiber.StatusServiceUnavailable).JSON(response)
  }
  defer res.Body.Close()
 
  scanner := bufio.NewScanner(res.Body)
  for scanner.Scan() {
    line := scanner.Text()
    var streamResponse ResponsePayload 
    if err := json.Unmarshal([]byte(line), &streamResponse); err == nil {
        fmt.Print(streamResponse.Response)
    }
  }
  // body, err := io.ReadAll(res.Body)
  // if err != nil {
  //   response := APIResponse{
  //     Error: true,
  //     Message: "error reading response body from ollama",
  //   }
  //   return c.Status(fiber.StatusBadGateway).JSON(response)
  // }
  //
  // var resp ResponsePayload
  // err = json.Unmarshal(body, &resp)
  // if err != nil {
  //   response := APIResponse{
  //     Error: true,
  //     Message:fmt.Sprintf("error unmarshling body to response payload err: %v", err),
  //   }
  //   return c.Status(fiber.StatusBadRequest).JSON(response)
  // }
  //
  response:= APIResponse{
    Error: false,
    Message: "successfully get the response",
  }

  return c.Status(fiber.StatusOK).JSON(response)


}
