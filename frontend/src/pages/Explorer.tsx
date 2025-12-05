import { PaginationController } from "@/components/ui/PaginationController";
import { ResumeItemCard } from "@/components/ui/ResumeItemCard";
import { useExplorer } from "@/hooks/useExplorer";

export const ExplorerPage = () => {
  const { items, paginationAction } = useExplorer();

  if (!items) return null;

  return (
    <main className="flex flex-col items-center gap-4 py-8 animate-fadeIn">
      {items.results.map((i) => (
        <ResumeItemCard key={i.url} resume={i} />
      ))}

      <PaginationController
        next={items.next}
        previous={items.previous}
        nextAction={() => paginationAction(items.next)}
        previousAction={() => paginationAction(items.previous)}
      />
    </main>
  );
};
