import { IsNotEmpty } from 'class-validator';

export class WeatherRequest {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  temperature: number;

  @IsNotEmpty()
  umidade: number;

  @IsNotEmpty()
  wind: number;

  @IsNotEmpty()
  sky: number;

  @IsNotEmpty()
  precipitation_probability: number;
}
