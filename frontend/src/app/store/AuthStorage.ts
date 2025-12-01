import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Payload, User } from "../types/global";
import { LOCALSTORAGE_KEYS } from "@/lib/app.constants";

interface AuthStorage {
  accessToken: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  refreshToken: (newToken: string | null) => void;
  payload: () => Payload | null;
}

export const useAuthStorage = create<AuthStorage>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,

      payload: () => {
        const token = get().accessToken;

        if (!token) return null;
        const parts = token.split(".");

        return JSON.parse(atob(parts[1]));
      },

      refreshToken: (newToken: string | null) => {
        if (!newToken) {
          localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN);
          return;
        }

        set({ accessToken: newToken });

        localStorage.setItem(LOCALSTORAGE_KEYS.TOKEN, newToken);
      },
      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const storeToken = localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN);

          if (storeToken) {
            state.accessToken = storeToken;
          }
        }
      },
    }
  )
);
