import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useAuthStorage } from "@/app/store/AuthStorage";
import { useInsightsStorage } from "@/app/store/InsightsStorage";
import { weatherService } from "@/services/weather.service";
import { ChartBar, ScrollText, TextInitial } from "lucide-react";
import { use } from "react";
import { useToast } from "./useToast";

export const useActionsWeather = () => {
  const { accessToken: token } = useAuthStorage();
  const { setView } = use(MenuViewContext);
  const { setInsights } = useInsightsStorage();
  const { error } = useToast();

  const exportType = async (format: "csv" | "xlsx") => {
    if (!token) return;
    const response = await weatherService.exportArchive(token, format);

    const blob = new Blob([response], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `logs.${format}`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const buttons = [
    {
      text: "Insights de IA",
      icon: ScrollText,
      onClick: async () => {
        setView("insights");

        if (!token) return;

        try {
          const response = await weatherService.insights(token);
          setInsights(response);
        } catch {
          return error("Desculpe não foi possível criar Insights.");
        }
      },
    },
    {
      text: "Exportar CSV",
      icon: TextInitial,
      onClick: async () => await exportType("csv"),
    },
    {
      text: "Exportar XLSX",
      icon: ChartBar,
      onClick: async () => await exportType("xlsx"),
    },
  ];

  return {
    buttons,
  };
};
