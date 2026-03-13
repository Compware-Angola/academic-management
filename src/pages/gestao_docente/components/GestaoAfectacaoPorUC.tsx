import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

const GestaoAfectacaoPorUC = () => {
  const unidadeCurricularKey = useId();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { mutateAsync, isPending } = useMutationUpdateAfectacaoStatus();
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    semestre: "",
    docente: "",
    curso: "",
    anoCurricular: "all",
    unidadeCurricular: "all",
  });

  const { data: teachersData = [] } = useQueryTeacther();
  const { data: afectacoesResponse, isLoading } =
    useQueryGestaoAfectacaoDocentes({
      anoLectivo: parseFilter(filters.anoLectivo),
      docente: parseFilter(filters.docente),
      semestre: parseFilter(filters.semestre),
      curso: parseFilter(filters.curso),
      anoCurricular: parseFilter(filters.anoCurricular),
      unidadeCurricular: parseFilter(filters.unidadeCurricular),
      limit,
      page,
    });

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe: filters.anoCurricular == "all" ? null : filters.anoCurricular,
    });
  const updateAfectacaoStatus = (codigo: number, status: boolean) => {
    mutateAsync({
      codigo,
      payload: {
        status: +status,
      },
    });
  };
  const canLoadUcs = !!filters.curso && !!filters.semestre;
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
              value={filters.semestre}
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
            />
            <CourseSelect
              value={filters.curso}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />
            <AnoCurricularSelect
              enableDefaultSelectItem
              value={filters.anoCurricular}
              onChangeValue={(v) =>
                setFilters({ ...filters, anoCurricular: v })
              }
              curso={filters.curso}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !filters.curso
                        ? "Selecione curso"
                        : !filters.semestre
                          ? "Selecione semestre"
                          : isLoadingUC
                            ? "Carregando UCs..."
                            : "Selecionar UC"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem key={unidadeCurricularKey} value="all">
                    Todos
                  </SelectItem>
                  {unidadesCurriculares.map((uc) => (
                    <SelectItem key={uc.pk} value={uc.pk.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      <TableHead>Curso</TableHead>
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
                        <TableCell>{item.curso}</TableCell>
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
export { GestaoAfectacaoPorUC };
