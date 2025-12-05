import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/Card";
import { Button } from "@/components/base/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/base/Input";
import { useLogin } from "@/hooks/useLogin";
import { Label } from "@radix-ui/react-label";
import { Cloud } from "lucide-react";

export const LoginPage = () => {
  const { actions, inputs, errors } = useLogin();

  return (
    <main className="w-full h-screen flex">
      <section className="bg-primary w-1/2 h-screen flex flex-col justify-center items-center">
        <Cloud className="w-24 h-auto stroke-text-inverse" />
        <h1 className="text-text-inverse text-6xl font-bold">Weather Gen</h1>
      </section>

      <section className="w-1/2 h-screen flex justify-center items-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-text-primary text-2xl font-semibold text-center">
              LOGIN
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Label className="flex items-center" htmlFor="email">
              Email
              <ErrorMessage message={errors.messages.email} />
            </Label>
            <Input {...inputs.email} />

            <Label className="flex items-center" htmlFor="password">
              Senha
              <ErrorMessage message={errors.messages.password} />
            </Label>
            <Input {...inputs.password} />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="font-semibold text-text-inverse w-full"
              {...actions.login}
            >
              Login
            </Button>
            <Button
              className="font-semibold text-primary w-full bg-transparent hover:bg-blue-100 border-primary border"
              {...actions.register}
            >
              Registro
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
};
