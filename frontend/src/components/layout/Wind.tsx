import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import type { WeatherLog } from "@/app/types/global";
import { use } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

interface WindProps {
  logs: WeatherLog[];
}

const TooltipContent = ({
  label,
  payload,
}: TooltipContentProps<number, string>) => {
  if (!label) return null;

  const time = new Date(payload[0].payload.createdAt);

  return (
    <div className="bg-slate-50 p-3 rounded-md border border-gray-300">
      <p>{`Horário: ${time.getHours()}:${
        time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
      }`}</p>
      <p className="text-lime-600 font-semibold">{`Vento: ${label} km/h`}</p>
    </div>
  );
};

export const Wind = ({ logs }: WindProps) => {
  const { view } = use(MenuViewContext);

  if (view !== "wind") return null;

  return (
    <AreaChart
      data={logs}
      responsive
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "40vh",
        aspectRatio: 1.6,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="wind" />
      <YAxis width="auto" />
      <Tooltip content={TooltipContent} />
      <Area
        type="monotone"
        dataKey="wind"
        stroke="#3D5B15"
        fill="#8EC63F"
      />
    </AreaChart>
  );
};
