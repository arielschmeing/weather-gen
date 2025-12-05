import { Button } from "@/components/base/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/base/Input";
import { useRegister } from "@/hooks/useRegister";
import { Label } from "@radix-ui/react-label";

export const RegisterPage = () => {
  const { inputs, errors, actions } = useRegister();

  return (
    <main className="flex justify-center items-center h-screen bg-primary">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Criar sua conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {inputs.map((input) => (
            <>
              <Label className="flex items-center" htmlFor={input.type}>
                {input.text}
                <ErrorMessage message={errors.messages[input.id]} />
              </Label>
              <Input {...input} />
            </>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full font-semibold text-text-inverse"
            {...actions.register}
          >
            Criar Conta
          </Button>
          <Button
            className="w-full font-semibold text-primary bg-transparent border border-primary hover:bg-blue-100"
            {...actions.login}
          >
            Voltar para login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};
