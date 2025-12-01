import { create } from "zustand";
import type { Insights } from "../types/global";

interface InsightsStorage {
  insights: Insights | null;
  setInsights: (newInsights: Insights | null) => void;
}

export const useInsightsStorage = create<InsightsStorage>((set) => ({
  insights: null,
  setInsights: (newInsights: Insights | null) => {
    set({ insights: newInsights });
  },
}));
