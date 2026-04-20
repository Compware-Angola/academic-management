import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { TabsContent } from "@/components/ui/tabs";
import { useStudentAcademicHistory } from "@/hooks/students/use-query-students";
import { parseFilter } from "@/util/parse-filter";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function FiltrarPorAvaliacoes({
  codigoMatricula,
  value = "filtrar-por-avaliacao",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  const [academicYear, setAcademicYear] = useState<string | undefined>("23");
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading } = useStudentAcademicHistory({
    matriculaId: codigoMatricula,
    anoLectivoId: parseFilter(academicYear),
    search: searchDebounce,
    page,
    limit,
  });

  return (
    <TabsContent value={value} className="space-y-4">
      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="w-full max-w-xs">
            <AcademicYearSelect
              value={academicYear}
              onChangeValue={(val) => {
                setAcademicYear(val);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Linha Inferior: Input alinhado à direita */}
        <div className="flex w-full">
          <div className="ml-auto w-full sm:max-w-xs">
            <Input
              placeholder="Pesquisar..."
              className="w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 rounded-md border bg-card">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px] w-full border-collapse">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="whitespace-nowrap px-4">Curso</TableHead>
                <TableHead className="whitespace-nowrap px-4">
                  Unidade curricular
                </TableHead>
                <TableHead className="whitespace-nowrap px-4">Classe</TableHead>
                <TableHead className="whitespace-nowrap px-4">
                  Tipo avaliação
                </TableHead>
                <TableHead className="text-center whitespace-nowrap px-4">
                  Nota
                </TableHead>
                <TableHead className="whitespace-nowrap px-4">
                  Data lançamento
                </TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center">
                  Nota Anterior
                </TableHead>
                <TableHead className="whitespace-nowrap px-4">
                  Ano Lectivo
                </TableHead>
                <TableHead className="whitespace-nowrap px-4">
                  Lançado por
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24">
                    <div className="flex items-center justify-center">
                      <Loader2
                        className="animate-spin text-primary"
                        size={20}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !response?.data?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                response.data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="text-sm whitespace-nowrap px-4">
                      {item.curso}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap px-4">
                      {item.unidade_curricular}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4">
                      {item.ano_curricular}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4">
                      {item.tipo_avaliacao}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap px-4">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.nota < 10
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.nota}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap px-4">
                      {item.datalancamento
                        ? format(new Date(item.datalancamento), "dd/MM/yyyy")
                        : "---"}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground whitespace-nowrap px-4">
                      {item.nota_anterior === -1
                        ? "Sem avaliações"
                        : item.nota_anterior}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4">
                      {item.ano_lectivo}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap px-4">
                      {item.utilizador}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Avaliações <strong>{response?.data?.length ?? 0}</strong>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft size={16} className="mr-1" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!response?.hasNextPage || isLoading}
          >
            Próximo <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
