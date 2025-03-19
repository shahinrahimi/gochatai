package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

type jsonResponse struct {
  Error bool `json:"error"`
  Message string `json:"message"`
  Data any `json:"data,omitempty"`
}

func WriteJSON(w http.ResponseWriter, status int, data any, headers ...http.Header) error {
  if len(headers) > 0 {
    for key, value := range headers[0] {
      w.Header()[key] = value
    }
  }

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(status)

  if err := json.NewEncoder(w).Encode(data); err != nil {
    return err
  }
  return nil 
}

func ReadJSON(w http.ResponseWriter ,r *http.Request, data any) error {
  maxBytes := 1024 * 1024 // 1mb
  // check doc for MaxBytesReader
  r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))
  defer r.Body.Close()
  // create decoder
  dec := json.NewDecoder(r.Body)
  
  if err := dec.Decode(data); err != nil {
    return err
  }

  // make sure only and only one json object
  if err := dec.Decode(&struct{}{}); err != io.EOF {
    return errors.New("body must have only a single JSON value")
  } 

  return nil
}

func ErrorJSON(w http.ResponseWriter, err error, status ...int) error {
  statusCode := http.StatusBadRequest // default
  if len(status) > 0 {
    statusCode = status[0]
  }

  return WriteJSON(w, statusCode, &jsonResponse{
    Error: true,
    Message: err.Error(),
  })
}


func MakeAPIRequest(method, url string, requestBody any, responseBody any) error {
  // convert reuestBody to JSON
  jsonData, err := json.Marshal(requestBody)
  if err != nil {
    return err
  }

  // create HTTP request
  req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonData))
  if err != nil {
    return err
  }

  req.Header.Set("Content-Type", "application/json")

  cl := http.Client{}
  resp, err := cl.Do(req)
  if err != nil {
    return err
  }
  defer resp.Body.Close()

  body, err := io.ReadAll(resp.Body)
  if err != nil {
    return err
  }
  
  return json.Unmarshal(body, responseBody)

}




