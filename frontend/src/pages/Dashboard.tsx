import { ToggleLogs } from "@/components/ui/ToggleLogs";
import { DetailWeather } from "@/components/layout/DetailWeather";
import { Precipitation } from "@/components/layout/Precipitation";
import { Temperature } from "@/components/layout/Temperature";
import { Umidade } from "@/components/layout/Umidade";
import { Wind } from "@/components/layout/Wind";
import { useDashboard } from "@/hooks/useDashboard";
import { InsightsCard } from "@/components/layout/InsightsCard";
export const DashboardPage = () => {
  const { lastLog, logs, setLogs, view, logType } = useDashboard();

  if (view === "user") return;

  return (
    <main className="relative flex items-center justify-center h-[calc(100vh_-_68px_-1.25rem)] gap-12">
      <h1
        className={`font-semibold text-2xl absolute top-[15%] transition-all duration-300 ease-in-out ${
          view === "current" ? "opacity-100" : "opacity-0"
        }`}
      >
        Bem-vindo ao Weather Gen
      </h1>

      {lastLog && <DetailWeather log={lastLog} />}

      <div
        className={`${
          view !== "current" ? "relative w-full max-w-[700px]" : ""
        }`}
      >
        {view !== "current" && view !== "insights" && (
          <ToggleLogs logType={logType} setLogs={setLogs} />
        )}
        <Precipitation logs={logs} />
        <Temperature logs={logs} />
        <Umidade logs={logs} />
        <Wind logs={logs} />
        <InsightsCard />
      </div>
    </main>
  );
};
