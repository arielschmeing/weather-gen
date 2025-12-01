import type { Cache } from "@/app/types/global";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const DAYS_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const DAY_TIME =
  HOURS_IN_DAY * SECONDS_IN_MINUTE * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

interface ValidationCache<T> {
  cache: Map<string, Cache<T>>;
  key: string;
  time: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lastDay() {
  return Date.now() - DAY_TIME;
}

export function lastWeek() {
  return Date.now() - DAYS_IN_WEEK * DAY_TIME;
}

export function validationCache<T>({ cache, key, time }: ValidationCache<T>) {
  const cached = cache.get(key);

  if (!cached?.value || !cached?.lastReq) {
    return;
  }

  const cacheAge = Date.now() - cached.lastReq.getTime();

  if (cacheAge < time) {
    return cached.value;
  }

  cache.delete(key);
  return;
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
