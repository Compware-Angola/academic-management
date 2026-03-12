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
import { useQueryAfectacaoDocentes } from "@/hooks/gestao-docente/use-query-afectacao.service";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useId, useState } from "react";
import { useMutationUpdateAfectacaoStatus } from "@/hooks/gestao-docente/use-mutation-update-afectacao-status";

const GestaoAfectacaoPorDocente = () => {
  const id = useId();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { mutateAsync, isPending } = useMutationUpdateAfectacaoStatus();
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    semestre: "",
    docente: "",
  });
  const defaultSelectItem = [
    {
      label: "Todos",
      value: "all",
      key: id,
    },
  ];
  const { data: teachersData = [] } = useQueryTeacther();
  const { data: afectacoesResponse, isLoading } = useQueryAfectacaoDocentes({
    anoLectivo: parseFilter(filters.anoLectivo),
    docente: parseFilter(filters.docente),
    semestre: parseFilter(filters.semestre),
    limit,
    page,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        );
      case "Aprovado":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Aprovado
          </Badge>
        );

      case "Regeitado":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Regeitado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  const updateAfectacaoStatus = (codigo: number, status: boolean) => {
    mutateAsync({
      codigo,
      payload: {
        status: +status,
      },
    });
  };
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
                value={filters.docente}
                options={teachersData}
                map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
                onChange={(codigo) =>
                  setFilters({ ...filters, docente: codigo })
                }
              />
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
                      <TableHead>Semestre</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>UC</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Afectado Por</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {afectacoes.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{item.docente}</TableCell>
                        <TableCell>{item.semestre}</TableCell>
                        <TableCell>{item.classe}</TableCell>
                        <TableCell> {item.uc}</TableCell>
                        <TableCell>{item.categoria}</TableCell>
                        <TableCell>{item.afectadopor}</TableCell>

                        <TableCell className="text-center flex space-x-2">
                          {formatarData(item.data)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            onCheckedChange={(v) =>
                              updateAfectacaoStatus(item.codigo, v)
                            }
                            id="deleted-mode"
                            checked={item.estado == 1}
                          />
                        </TableCell>
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
export { GestaoAfectacaoPorDocente };
