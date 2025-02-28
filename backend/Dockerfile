FROM docker.arvancloud.ir/golang:1.24-alpine AS builder

WORKDIR /app

COPY . .

RUN GOOS=linux CGO_ENABLED=0 go build -o /bin/backendApi ./cmd/api/

FROM docker.arvancloud.ir/alpine:latest

WORKDIR /app

COPY --from=builder /bin/backendApi .

CMD ["/app/backendApi"]

