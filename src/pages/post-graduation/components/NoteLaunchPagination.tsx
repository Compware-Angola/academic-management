import { Button } from "@/components/ui/button";

type NoteLaunchPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
};

export function NoteLaunchPagination({
  page,
  totalPages,
  total,
  isFetching,
  onPageChange,
}: NoteLaunchPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Página {page} de {totalPages}. Total: {total} estudantes.
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}