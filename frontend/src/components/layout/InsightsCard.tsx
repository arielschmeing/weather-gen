import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../base/Card";
import { AlertTriangleIcon, CloudCheck, Stars } from "lucide-react";
import { useInsightsCard } from "@/hooks/useInsightsCard";
import { capitalize } from "@/lib/utils";
import { Spinner } from "../base/Spinner";

export const InsightsCard = () => {
  const { view, bodySections, insights } = useInsightsCard();

  if (view !== "insights") return null;

  if (!insights)
    return (
      <div className="max-w-xl max-h-xl flex items-center justify-center">
        <Spinner className="mr-2" />
        <span className="mb-1">Carregando</span>
      </div>
    );

  return (
    <Card>
      <CardHeader className="bg-blue-400 rounded-tl-lg rounded-tr-lg">
        <CardDescription className="flex items-center gap-2 text-slate-200">
          <Stars className="stroke-slate-200 w-5" />
          Insights gerados por IA
        </CardDescription>
        <CardTitle className="text-slate-200 font-semibold text-2xl">
          Análise do Clima
        </CardTitle>
      </CardHeader>
      <CardContent>
        <section className="flex border-b-[1px]">
          {bodySections.map((bs) => (
            <div className="p-6">
              <p className="text-text-secondary">{bs.title}</p>
              <h3 className="font-bold text-2xl">{bs.value}</h3>
            </div>
          ))}
        </section>
        <section className="flex p-6 justify-between items-center border-b-[1px]">
          <div>
            <p className="text-text-secondary">Classificação do Dia:</p>
            <h4 className="font-bold text-2xl">
              {capitalize(insights.temperatureTrend)} &{" "}
              {capitalize(insights.dayClassification)}
            </h4>
          </div>
          <p className="font-bold text-xl">
            Conforto: {insights.comfortScore}/100
          </p>
        </section>
        <section className="p-6 border-b-[1px]">
          <div className="flex gap-2 items-center">
            <CloudCheck className="stroke-blue-400" />
            <p className="font-semibold text-lg">Resumo Inteligente</p>
          </div>
          <p className="text-text-secondary mt-2">{insights.summary}</p>
        </section>
      </CardContent>
      <CardFooter className="flex flex-col items-start px-12">
        <div className="flex gap-2 items-center">
          <AlertTriangleIcon className="stroke-orange-400" />
          <h4 className="font-semibold text-lg">Pontos de Alerta</h4>
        </div>
        <div className="flex">
          {insights.alerts.map((alert) => (
            <p
              key={alert}
              className="mark-sphare before:bg-orange-400 text-orange-950 bg-orange-50 text-sm px-4 py-2 rounded-lg my-2"
            >
              {alert}
            </p>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
