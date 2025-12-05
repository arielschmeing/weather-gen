import { Button } from "@/components/base/Button";
import { ROUTER_PATHS } from "@/lib/app.constants";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen gap-10">
      <section className="flex flex-col gap-5 max-w-xl text-center">
        <h1 className="text-4xl font-bold text-text-primary">
          Ouve um erro ao encontrar a página.
        </h1>
        <p className="text-text-secondary">
          Não conseguimos achar a página em questão, volte para página de login
          por favor.
        </p>
      </section>
      <Button
        onClick={() => navigate(ROUTER_PATHS.LOGIN)}
        className="transition-all duration-300 text-text-inverse text-md"
      >
        <ArrowBigLeft />
        Voltar para Login
      </Button>
    </main>
  );
};
