import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useAuthStorage } from "@/app/store/AuthStorage";
import type { LogType, WeatherLog } from "@/app/types/global";
import { lastDay, lastWeek } from "@/lib/utils";
import { weatherService } from "@/services/weather.service";
import { use, useEffect, useMemo, useState } from "react";
import { useToast } from "./useToast";

export const useDashboard = () => {
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [logType, setLogType] = useState<LogType>("daily");
  const { accessToken } = useAuthStorage();
  const { view } = use(MenuViewContext);
  const { error } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!accessToken) return error("Por favor faça login novamente.")

      try {
        const response = await weatherService.logs(accessToken);
        setLogs(response);
      } catch {
        return error("Clima não resgatado.")
      }

    };
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterLogs = useMemo(() => {
    if (logType === "daily")
      return logs.filter((l) => new Date(l.createdAt).getTime() >= lastDay());

    if (logType === "week")
      return logs.filter((l) => new Date(l.createdAt).getTime() >= lastWeek());

    return logs;
  }, [logType, logs]);

  return {
    lastLog: logs[logs.length - 1],
    logs: filterLogs,
    setLogs: setLogType,
    logType,
    view,
  };
};
