import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryGestaoAfectacaoDocentes } from "@/hooks/gestao_docente/use-query-gestao-afectacao.service";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useId, useState } from "react";
import { useMutationUpdateAfectacaoStatus } from "@/hooks/gestao_docente/use-mutation-update-afectacao-status";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDocentesAfectacao } from "@/hooks/gestao_docente/use-query-docentes-afectacao";

const DocentAfectacaoItem = () => {
  const id = useId();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { mutateAsync, isPending } = useMutationUpdateAfectacaoStatus();
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    semestre: "",
    docente: "",
  });

  const { data: teachersData = [] } = useQueryTeacther();
  const { data: afectacoesResponse, isLoading } = useQueryDocentesAfectacao({
    anoLectivo: parseFilter(filters.anoLectivo),
    docente: parseFilter(filters.docente),
    tipoAfectacao: 1,
    semestre: parseFilter(filters.semestre),
    limit,
    page,
  });

  const afectacoes = afectacoesResponse?.data ?? [];
  const total = afectacoesResponse?.total;
  const totalPages = afectacoesResponse?.totalPages;
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-3">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <SemestreSelect
              enableDefaultSelectItem
              value={filters.semestre}
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
            />
            <div className="space-y-1.5">
              <Label>Docente</Label>
              <FormCommandSelect
                width="full"
                value={filters.docente}
                options={teachersData}
                map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
                onChange={(codigo) =>
                  setFilters({ ...filters, docente: codigo })
                }
              />
            </div>
            <div>
              <Label>Data Inicio</Label>
              <Input placeholder="Data inicial" type="date" />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input placeholder="Data inicial" type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Afectação</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Afectação...</p>
            </div>
          ) : afectacoes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum Afectação encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Nº Mecanográfico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {afectacoes.map((item) => (
                      <TableRow key={item.codigo_docente}>
                        <TableCell>{item.codigo_docente}</TableCell>
                        <TableCell>{item.docente}</TableCell>
                        <TableCell>{item.mecanografico}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {afectacoes.length} de {total} registos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
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
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export { DocentAfectacaoItem };
