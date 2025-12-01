import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useAuthStorage } from "@/app/store/AuthStorage";
import type { LogType, WeatherLog } from "@/app/types/global";
import { lastDay, lastWeek } from "@/lib/utils";
import { weatherService } from "@/services/weather.service";
import { use, useEffect, useMemo, useState } from "react";

export const useDashboard = () => {
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [logType, setLogType] = useState<LogType>("daily");
  const { accessToken } = useAuthStorage();
  const { view } = use(MenuViewContext);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await weatherService.logs(accessToken);
      if (!response) return;

      setLogs(response);
    };
    fetchLogs();
  }, [accessToken]);

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
