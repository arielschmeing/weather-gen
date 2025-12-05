import type { LogType } from "@/app/types/global";
import { ToggleGroup, ToggleGroupItem } from "../base/ToggleGroup";

interface ToggleLogsProps {
  logType: LogType;
  setLogs: (value: LogType) => void;
}

export const ToggleLogs = ({ logType, setLogs }: ToggleLogsProps) => {
  const className =
    "transition-all duration-300 font-semibold data-[state=on]:bg-green-600 data-[state=on]:text-text-inverse";

  return (
    <ToggleGroup
      type="single"
      value={logType}
      onValueChange={(v: string) => v && setLogs(v as "all" | "daily")}
      className="absolute top-[-60px] left-8"
      variant="outline"
    >
      <ToggleGroupItem className={className} value="all">
        Todo Tempo
      </ToggleGroupItem>
      <ToggleGroupItem className={className} value="week">
        Semana
      </ToggleGroupItem>
      <ToggleGroupItem className={className} value="daily">
        Hoje
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
