import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
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
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useMutationUpdateProgramaUCEstado } from "@/hooks/docentes/use-mutation-docente-programa-status";
import { useQueryDocenteListProgramaUC } from "@/hooks/docentes/use-query-docente-programa-uc";
import { useQueryProgramaUCEstado } from "@/hooks/docentes/use-query-docente-programa-uc-status";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";
import { Check, Loader2, Paperclip, X } from "lucide-react";

import { useId, useState } from "react";

const ValidacaoProgramaComUC = () => {
  const id = useId();
  const { mutateAsync, isPending } = useMutationUpdateProgramaUCEstado();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    estado: "",
  });
  const defaultSelectItem = [
    {
      label: "Todos",
      value: "all",
      key: id,
    },
  ];

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe: filters.anoCurricular,
    });
  const { data: programaEstados, isLoading: loadingProgramaEstado } =
    useQueryProgramaUCEstado();

  const canLoadUcs = !!filters.curso && !!filters.semestre;

  const { data: programaUcResponse, isLoading } = useQueryDocenteListProgramaUC(
    {
      anoCurricular: parseFilter(filters.anoCurricular),
      anoLectivo: parseFilter(filters.anoLectivo),
      codigoCurso: parseFilter(filters.curso),
      semestre: parseFilter(filters.semestre),
      unidadeCurricular: parseFilter(filters.unidadeCurricular),
      estado: parseFilter(filters.estado),
      page,
      limit,
    },
  );
  const updateProgramaUCStatus = (programaId: number, status: number) => {
    mutateAsync({
      programaUcId: programaId,
      payload: {
        estado: status,
      },
    });
  };
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
  const programas = programaUcResponse?.data ?? [];
  const total = programaUcResponse?.total;
  const totalPages = programaUcResponse?.totalPages;
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-4">
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
                  {unidadesCurriculares.map((uc) => (
                    <SelectItem key={uc.pk} value={uc.pk.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormSelect
              disabled={loadingProgramaEstado}
              loading={loadingProgramaEstado}
              defaultSelectItem={defaultSelectItem}
              label="Estado"
              value={filters.estado}
              onChange={(v) => setFilters({ ...filters, estado: v })}
              options={programaEstados ?? []}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Programas com UC</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : programas.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum Programa encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>UC</TableHead>
                      <TableHead>Data de Lançamento</TableHead>
                      <TableHead>Data de Validação</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programas.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{item.anolectivo}</TableCell>
                        <TableCell>{item.docente}</TableCell>
                        <TableCell>{item.gradecurricular}</TableCell>
                        <TableCell> {formatarData(item.datacriacao)}</TableCell>
                        <TableCell>
                          {formatarData(item.dataactualizacao)}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.estado)}</TableCell>

                        <TableCell className="text-center flex space-x-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="bg-blue-500 text-white"
                              size="icon"
                            >
                              <Paperclip />
                            </Button>
                          </div>
                          {item.codigo_estado == 1 && (
                            <>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    updateProgramaUCStatus(item.codigo, 2)
                                  }
                                  className="bg-success text-white"
                                  size="icon"
                                >
                                  {isPending ? <Loader2 /> : <Check />}
                                </Button>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() =>
                                    updateProgramaUCStatus(item.codigo, 3)
                                  }
                                  variant="outline"
                                  className="bg-destructive text-white"
                                  size="icon"
                                >
                                  {isPending ? <Loader2 /> : <X />}
                                </Button>
                              </div>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {programas.length} de {total} registos
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
export { ValidacaoProgramaComUC };
