export const API = "http://localhost:3000/api/";

export const ROUTER_PATHS = {
  ERROR: "*",
  ROOT: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USER: "/user",
  EXPLORER: "/explorer",
} as const;

export const API_PATHS = {
  LOGIN: `${API}auth/login`,
  USERS: `${API}users`,
  USER_NAME: `${API}users/name`,
  USER_PASSWORD: `${API}users/password`,
  WEATHER_LOGS: `${API}weather/logs`,
  EXPORT_CSV: `${API}weather/export.csv`,
  EXPORT_XLSX: `${API}weather/export.xlsx`,
  INSIGHTS: `${API}weather/insight`,
  EXPLORER_ITEMS: `${API}explorer/items`,
} as const;

export const SKY_TYPES = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Névoa",
  48: "Névoa – geada/depósito",
  51: "Chuvisco leve",
  53: "Chuvisco moderado",
  55: "Chuvisco intenso",
  56: "Chuvisco congelante leve",
  57: "Chuvisco congelante intenso",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva intensa",
  66: "Chuva congelante leve",
  67: "Chuva congelante intensa",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve intensa",
  77: "Granizo / neve granular",
  80: "Pancada de chuva leve",
  81: "Pancada de chuva moderada",
  82: "Pancada de chuva intensa",
  85: "Pancada de neve leve",
  86: "Pancada de neve intensa",
  95: "Tempestade",
  96: "Tempestade com granizo leve",
  99: "Tempestade com granizo intenso",
} as const;

export const LOCALSTORAGE_KEYS = {
  TOKEN: "access-token-storage",
} as const;
