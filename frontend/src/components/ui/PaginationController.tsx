import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../base/Pagination";

interface PaginationControllerProps {
  previous: string | null;
  next: string | null;
  previousAction: () => void;
  nextAction: () => void;
}

export const PaginationController = ({
  previous,
  next,
  previousAction,
  nextAction,
}: PaginationControllerProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="flex">
          <PaginationPrevious
            onClick={() => previousAction()}
            className={
              !previous ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => nextAction()}
            className={
              !next ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
