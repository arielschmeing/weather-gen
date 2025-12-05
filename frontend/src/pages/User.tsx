import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/Card";
import { AlertRemoveUser } from "@/components/ui/AlertRemoveUser";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/base/Item";
import { useUser } from "@/hooks/useUser";

export const UserPage = () => {
  const { user, items, inputs, handlerDeleteAccount } = useUser();

  if (!user) return null;

  return (
    <main className="flex justify-center pt-4">
      <div className="max-w-5xl w-full">
        <Card className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="mb-4">Informações da Conta.</CardTitle>
            <CardContent className="px-0 gap-4 flex flex-col">
              {items.map((item) => (
                <Item key={item.value} variant="outline">
                  <item.icon />
                  <ItemContent>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDescription>{item.value}</ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </CardContent>
            <CardFooter className="px-0 flex justify-center">
              <AlertRemoveUser onClick={handlerDeleteAccount} />
            </CardFooter>
          </CardHeader>
        </Card>
        <Card className="mt-4 animate-fadeIn">
          <CardContent>
            {inputs.map((input) => (
              <Item key={input.title}>
                <ItemContent>
                  <ItemTitle>{input.title}</ItemTitle>
                  <Input {...input.props} />
                </ItemContent>
                <ItemActions>
                  <Button
                    className="mt-6 bg-green-200 hover:bg-green-100 hover:border hover:border-green-400 transition-all duration-300 text-green-500 font-semibold"
                    onClick={input.onClick}
                  >
                    Salvar
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
