FROM golang:1.21.0

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o weather-consumer .

CMD ["./weather-consumer"]