import z from 'zod';

export const envSchema = z.object({
  EXPLORER_API_URL: z.string(),
  MONGODB_USER: z.string(),
  MONGODB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(),
  API_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  AI_API_KEY: z.string(),
  API_PORT: z.coerce.number(),
  API_BASE: z.string(),
});
export type Env = z.infer<typeof envSchema>;
