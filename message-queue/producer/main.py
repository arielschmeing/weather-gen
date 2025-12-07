import os
import json
import pika
import time
import requests
from dotenv import load_dotenv

load_dotenv()

def get_weather():
  latitude = os.getenv('LATITUDE')
  longitude = os.getenv('LONGITUDE')

  r = requests.get(os.getenv('WEATHER_API_URL'), params={
    'latitude': latitude,
    'longitude': longitude,
    'current_weather': True,
    'hourly': [
        'relative_humidity_2m',
        'precipitation_probability'
    ]
  })

  r.raise_for_status()
  data = r.json()

  current = data['current_weather']
  hourly = data['hourly']

  return {
    'latitude': float(latitude),
    'longitude': float(longitude),
    'temperature': current['temperature'],              
    'umidade': hourly['relative_humidity_2m'][0],  
    'wind': current['windspeed'],                         
    'sky': current['weathercode'],                        
    'precipitation_probability': hourly['precipitation_probability'][0]
  }


def send_to_queue(payload):
  connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=os.getenv('RABBIT_HOST'),
        port=int(os.getenv('RABBIT_PORT'))
    )
  )
  channel = connection.channel()
  channel.queue_declare(queue='weather', durable=False)

  channel.basic_publish(
    exchange='',
    routing_key='weather',
    body=json.dumps(payload),
    properties=pika.BasicProperties(delivery_mode=2)
  )


def main():
  send_to_queue(get_weather())
  producer_time = int(os.getenv('PRODUCER_TIME'))
  time.sleep(producer_time)


if __name__ == '__main__':
  main()