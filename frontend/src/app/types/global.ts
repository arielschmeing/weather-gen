import type { SKY_TYPES } from "@/lib/app.constants";
import type { ChangeEvent } from "react";

export interface User {
  email: string;
  password?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payload {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  email: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register extends Login {
  name: string;
}

export interface ActionLogin {
  submit?: () => Login | undefined;
  refreshToken: (newToken: string) => void;
  data: Login;
}

export interface InputAttributes<T> {
  text: string;
  type: string;
  id: keyof T;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface Weather {
  temperature: number;
  umidade: number;
  wind: number;
  sky: keyof typeof SKY_TYPES;
  precipitation_probability: number;
}

export interface WeatherLog extends Weather {
  _id: string;
  createdAt: Date;
  latitude: number;
  longitude: number;
}

export interface GetUserRequest {
  token: string;
  id: string;
}

export interface Cache<T> {
  value: T;
  lastReq: Date;
}

export interface Insights {
  averageTemperature: number;
  averageHumidity: number;
  temperatureTrend: string;
  comfortScore: number;
  dayClassification: string;
  alerts: string[];
  summary: string;
}

export interface ItemsPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface Item {
  attributes: string[];
  category: string;
  cost: number | null;
  id: number;
  name: string;
  sprite: string;
}

export type LogType = "all" | "daily" | "week";

export type ViewType = "current" | "user" | "insights" | "explorer" | keyof Weather