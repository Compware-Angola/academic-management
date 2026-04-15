import { useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, Pencil, Trash } from "lucide-react";
import {
  useStudentDetail,
  useStudentDisciplinas,
} from "@/hooks/students/use-query-students";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ScheduleDetailsModal from "@/pages/schedules/components/ScheduleDetailsModal";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { parseFilter } from "@/util/parse-filter";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { HorarioSelect } from "@/components/common/global-selects/HorarioSelect";

type Props = {
  codigoMatricula: number;
  value?: string;
};
export function InscricoesSection({
  codigoMatricula: matricula,
  value = "inscricoes",
}: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [filter, setFilter] = useState({
    anoLetivo: "23",
    semestre: "1",
    classes: "",
  });
  const { data: student } = useStudentDetail(matricula);
  const {
    data: response,
    isLoading: isDisciplinasLoading,
    isError,
  } = useStudentDisciplinas({
    matriculaId: matricula ?? "",
    anoLectivo: parseFilter(filter.anoLetivo),
    semestre: parseFilter(filter.semestre),
    classes: parseFilter(filter.classes),
    page,
    limit,
  });

  const [isModalOpenDisciplina, setIsModalOpenDisciplina] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpenDisciplina(true);
  };

  const disciplinas = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = response?.totalPages ?? 1;

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  if (!matricula) {
    return <div>Matrícula inválida</div>;
  }

  const getEstadoLabel = (estado: string | undefined) => {
    if (!estado) return "—";
    if (estado === "Fez com Sucesso") return "Concluido";
    if (estado === "Pendente") return "Pendente";
    return estado;
  };

  return (
    <TabsContent value={value} className="space-y-4">
      <div>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Disciplinas</CardTitle>
          <CardDescription>
            Lista de todas as disciplinas cursadas e em curso
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AcademicYearSelect
              value={filter.anoLetivo}
              onChangeValue={(v) => setFilter({ ...filter, anoLetivo: v })}
            />
            <SemestreSelect
              label="Semestre"
              value={filter.semestre}
              onChangeValue={(v) => setFilter({ ...filter, semestre: v })}
            />
            <AnoCurricularSelect
              value={filter.classes}
              curso={student?.curso_codigo.toString()}
              onChangeValue={(v) => setFilter({ ...filter, classes: v })}
            />
          </div>

          {isDisciplinasLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-destructive py-10">
              Erro ao carregar as disciplinas. Tente novamente.
            </div>
          ) : disciplinas.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Nenhuma disciplina encontrada Para Este ano .
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead className="text-center">
                        Ano / Classe
                      </TableHead>
                      <TableHead className="text-center">Semestre</TableHead>
                      <TableHead className="text-center">
                        Sala / Horário
                      </TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disciplinas.map((disc) => (
                      <TableRow key={disc.codigo_disciplina}>
                        <TableCell className="font-mono text-sm">
                          {disc.codigo_disciplina}
                        </TableCell>
                        <TableCell className="font-medium">
                          {disc.disciplina}
                        </TableCell>
                        <TableCell className="text-center">
                          {disc.classe}
                        </TableCell>
                        <TableCell className="text-center">
                          {disc.semestre}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {disc.codigo_horario && (
                            <Button
                              variant="link"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => openDetails(disc.codigo_horario!)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {disc.estado === "Aprovado" ? (
                            <Badge
                              variant={
                                disc.estado === "Aprovado"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {getEstadoLabel(disc.estado)}
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label="Editar"
                                title="Editar"
                                className="cursor-pointer"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                className="cursor-pointer"
                                aria-label="Eliminar Inscrição"
                                title="Eliminar Inscrição"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Mostrando {disciplinas.length} de {total} disciplinas
                </div>

                <div className="flex items-center gap-6 order-1 sm:order-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">
                      Por página:
                    </span>
                    <Select
                      value={String(limit)}
                      onValueChange={(val) => {
                        setLimit(Number(val));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={page === 1 || isDisciplinasLoading}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm min-w-[90px] text-center">
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={page === totalPages || isDisciplinasLoading}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </div>

      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpenDisciplina}
        onClose={() => {
          setIsModalOpenDisciplina(false);
          setSelectedTurmaId(null);
        }}
      />
    </TabsContent>
  );
}
