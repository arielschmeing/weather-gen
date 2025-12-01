export interface InsightResponse {
  averageTemperature: number;
  averageHumidity: number;
  temperatureTrend: string;
  comfortScore: number;
  dayClassification: string;
  alerts: string[];
  summary: string;
}
