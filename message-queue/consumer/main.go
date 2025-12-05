package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Weather struct {
		Latitude float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
    Temperature float64 `json:"temperature"`
    Umidade int `json:"umidade"`
    Wind float64 `json:"wind"`
    Sky int `json:"sky"`
    PrecipitationProbability int `json:"precipitation_probability"`
}

func main() {
	amqpServerURL := os.Getenv("AMQP_SERVER_URL")

	config := amqp.Config{
		Heartbeat: 30 * time.Second,
	}

	connect, err := amqp.DialConfig(amqpServerURL, config)
	if err != nil {
		panic(err)
	}
	defer connect.Close()

	channel, _ := connect.Channel()

	channel.QueueDeclare("weather", false, false, false, false, nil)

	messagers, _ := channel.Consume("weather", "", false, false, false, false, nil)

	for message := range messagers {
		var weather Weather

		if err := json.Unmarshal(message.Body, &weather); err != nil {
			message.Nack(false, false)
			continue
		}

		for {
			err := sendToApi(weather)
			if err == nil {
				break
			}

			fmt.Printf("ALERTA: Tentativa falhou. Erro: %v. Tentando novamente em 60s.\n", err)

			time.Sleep(time.Minute)
		}

		message.Ack(false)
	}
}

func sendToApi(weather Weather) error {
	payload, err := json.Marshal(weather)
	
	if err != nil {
			return fmt.Errorf("erro ao serializar payload: %w", err)
	}

	request, err := http.NewRequest("POST", os.Getenv("API_CONSUMER_ENDPOINT"), bytes.NewBuffer(payload))
	
	if(err != nil) {
		return fmt.Errorf("erro ao criar a requisição: %w", err)
	}

	request.Header.Set("API-KEY", os.Getenv("API_KEY"))
	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	response, err := client.Do(request)

	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode < 200 || response.StatusCode >= 300 {
    return fmt.Errorf("status code %d", response.StatusCode)
  }

  return nil
}