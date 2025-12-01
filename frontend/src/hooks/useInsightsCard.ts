import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useInsightsStorage } from "@/app/store/InsightsStorage";
import { use } from "react";

export const useInsightsCard = () => {
  const { view } = use(MenuViewContext);
  const { insights } = useInsightsStorage();

  const bodySections = [
    {
      title: "Temperatura Média",
      value: `${insights?.averageTemperature}°C`,
    },
    {
      title: "Umidade Média",
      value: `${insights?.averageHumidity}%`,
    },
  ];

  return {
    insights,
    view,
    bodySections,
  };
};
