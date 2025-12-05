import z from 'zod';

export const InsightsSchema = z.object({
  averageTemperature: z.number(),
  averageHumidity: z.number(),
  temperatureTrend: z.string(),
  comfortScore: z.number(),
  dayClassification: z.string(),
  alerts: z.array(z.string()),
  summary: z.string(),
});

export type Insights = z.infer<typeof InsightsSchema>;
