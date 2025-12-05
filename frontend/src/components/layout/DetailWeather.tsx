import type { WeatherLog } from "@/app/types/global";
import { Card, CardContent, CardFooter, CardHeader } from "../base/Card";
import { useDetailWeather } from "@/hooks/useDetailWeather";
import { Cloud } from "lucide-react";
import { use } from "react";
import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { ActionsWeather } from "../ui/ActionsWeather";

interface DetailWeatherProps {
  log: WeatherLog;
}

export const DetailWeather = ({ log }: DetailWeatherProps) => {
  const { view } = use(MenuViewContext);
  const { attributes, updateTime } = useDetailWeather(log);

  return (
    <Card
      className={`max-w-xl shadow-md w-full ${
        view === "current" ? "animate-fadeIn" : "animate-fadeSlide"
      }`}
    >
      <CardHeader className="grid grid-cols-[auto,1fr] gap-x-3 items-center">
        <Cloud className="w-12 h-12 stroke-green-500" />
        <div className="flex flex-col">
          <h2 className="font-bold text-2xl">Clima Atual</h2>
          <p>Última atualização às {updateTime}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {attributes.map((attr) => (
          <div key={attr.text} className="flex justify-between font-semibold">
            <p className={`mark-sphare ${attr.className}`}>{attr.text}</p>
            <p className="text-text-secondary">{attr.value}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between my-4">
        <ActionsWeather />
      </CardFooter>
    </Card>
  );
};
