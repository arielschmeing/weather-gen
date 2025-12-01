import type { WeatherLog } from "@/app/types/global";
import { SKY_TYPES } from "@/lib/app.constants";

export const useDetailWeather = (log: WeatherLog) => {
  const time = new Date(log.createdAt);
  const updateTime = ` ${
    time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()
  }:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`;

  const attributes = [
    {
      text: "Temperatura:",
      value: `${log.temperature}°C`,
      className: "before:bg-orange-400 font-semibold",
    },
    {
      text: "Humidade:",
      value: `${log.umidade}%`,
      className: "before:bg-sky-500",
    },
    {
      text: "Vento:",
      value: `${log.wind} km/h`,
      className: "before:bg-lime-500",
    },
    {
      text: "Céu:",
      value: SKY_TYPES[log.sky],
      className: "before:bg-rose-500",
    },
    {
      text: "Precipitação:",
      value: `${log.precipitation_probability}%`,
      className: "before:bg-indigo-500",
    },
  ];

  return {
    attributes,
    updateTime,
  };
};
