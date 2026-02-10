import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IListaPresencaPaginacaoProps {
  hasNext: boolean;
  page: number;
  limit: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setLimit: (limit: number | ((prev: number) => number)) => void;
}
const ListaPresencaPaginacao = ({
  hasNext,
  limit,
  page,
  setLimit,
  setPage,
}: IListaPresencaPaginacaoProps) => {
  return (
    <>
      <div className="flex justify-end">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span>Página {page}</span>
            <Button
              variant="outline"
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>

            <Select
              value={String(limit)}
              onValueChange={(v) => {
                setLimit(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export { ListaPresencaPaginacao };
