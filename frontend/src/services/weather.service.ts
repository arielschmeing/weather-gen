import type { Cache, Insights, WeatherLog } from "@/app/types/global";
import { API_PATHS } from "@/lib/app.constants";
import { validationCache } from "@/lib/utils";
import axios, { HttpStatusCode } from "axios";

const CACHE_KEY = "weather_logs_cache";
const CACHE_DURATION = 60 * 60 * 1000;
const cacheWeatherLogs = new Map<string, Cache<WeatherLog[]>>();

const cacheInsights = new Map<string, Insights>();

export const weatherService = {
  async logs(token: string): Promise<WeatherLog[]> {
    const cache = validationCache({
      cache: cacheWeatherLogs,
      key: CACHE_KEY,
      time: CACHE_DURATION,
    });

    if (cache) return cache;

    const { data, status } = await axios.get<WeatherLog[]>(
      API_PATHS.WEATHER_LOGS,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (status !== HttpStatusCode.Ok)
      throw new Error("Erro ao ver registro do clima.");

    cacheWeatherLogs.set(CACHE_KEY, {
      value: data,
      lastReq: new Date(),
    });

    return data;
  },
  async exportArchive(token: string, format: "csv" | "xlsx") {
    const { data, status } = await axios.get(
      format === "csv" ? API_PATHS.EXPORT_CSV : API_PATHS.EXPORT_XLSX,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    if (status !== HttpStatusCode.Ok)
      throw new Error("Erro ao exportar arquivo.");

    return data;
  },
  async insights(token: string): Promise<Insights> {
    if (cacheInsights.has(token)) return cacheInsights.get(token)!;

    const { data, status } = await axios.post<Insights>(
      API_PATHS.INSIGHTS,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (status !== HttpStatusCode.Created)
      throw new Error("Erro ao comunicar com a IA.");

    cacheInsights.set(token, data);
    return data;
  },
};
