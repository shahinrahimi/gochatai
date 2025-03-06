package handlers

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

const (
  OllamaVBaseUrl = "http://host.docker.internal:11434" // access localhost:11434 in docker
)

func Ping(c *fiber.Ctx) error {
  return c.JSON(fiber.Map{"message": "pong"})
}

// Generate a completion
// POST => /api/generete
type OllamaGenerateRequestPayload struct {
  Model string `json:"model"`    
  Prompt string `json:"prompt"`   
  Stream bool `json:"stream"` 
}

type OllamaGenerateResponsePayload struct {
  Model string `json:"model"`
  Response string `json:"response"`
  Done bool `json:"done"` 
  PromptEvalCount int64  `json:"prompt_eval_count"`
  PromptEvalDuration int64 `json:"prompt_eval_duration"`
  EvalCount int64 `json:"eval_count"`
  EvalDuration int64 `json:"eval_duration"`
  TotalDuration int64 `json:"total_duration"`
  LoadDuration int64 `json:"load_duration"`
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

func Generate(c *fiber.Ctx) error {

  // parse requeset to struct
  var op OllamaGenerateRequestPayload 
  if err := c.BodyParser(&op); err != nil {
    return c.Status(fiber.StatusBadRequest).JSON(&APIResponse{
      Error: true,
      Message: "failed to parse request",
      Data: err,
    })
  }

  // struct to jsonData
  reqData, err := json.Marshal(op)
  if err != nil {
    return c.Status(fiber.StatusBadRequest).JSON(&APIResponse{
      Error: true,
      Message: "failed to marshal the struct",
      Data: err,
    })
  }


  // create a request 
  requestURL := fmt.Sprintf("%s%s", OllamaVBaseUrl, "/api/generate")
  req, err := http.NewRequest(http.MethodPost, requestURL, bytes.NewBuffer(reqData))
  if err != nil {
    return c.Status(fiber.StatusBadRequest).JSON(&APIResponse{
      Error: true,
      Message: "failed to create a new request",
      Data: err,
    })
  }

  cl := http.Client{}
  resp, err := cl.Do(req)
  if err != nil {
    return c.Status(fiber.StatusBadRequest).JSON(&APIResponse{
      Error: true,
      Message: "failed to make a request",
      Data: err,
    })
  } 
  defer resp.Body.Close()

  body, err := io.ReadAll(resp.Body)
  if err != nil {
    return c.Status(fiber.StatusBadRequest).JSON(&APIResponse{
      Error: true,
      Message: "failed to read body",
      Data: err,
    })
  }

  var ollamaResp OllamaGenerateResponsePayload
  if err := json.Unmarshal(body, &ollamaResp); err != nil {
    return c.Status(fiber.StatusBadGateway).JSON(&APIResponse{
      Error: true,
      Message: "failed to unmarshal the body",
      Data: err,
    })
  }

  return c.Status(fiber.StatusOK).JSON(&APIResponse{
    Error: false,
    Message: "successfully response generated",
    Data: ollamaResp,
  })

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
