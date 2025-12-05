import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/Card";
import { useItem } from "@/hooks/useItem";

export const ItemPage = () => {
  const { item } = useItem();

  if (!item) return null;

  return (
    <main className="h-[calc(100vh_-_68px_-1.25rem)] flex justify-center items-center">
      <Card className="max-w-xl w-full text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <CardDescription>
            Categoria: {item.category} | Custo: {item.cost}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <img
            className="w-20 [image-rendering:pixelated]"
            src={item.sprite}
            alt="Item"
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <h3 className="font-semibold text-md mb-2">Atributos:</h3>
          <div className="flex justify-center items-center gap-4">
            {item.attributes.map((a) => (
              <p className="mark-sphare before:bg-green-400">{a}</p>
            ))}
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};
