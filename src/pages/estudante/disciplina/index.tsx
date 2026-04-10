import { useState } from "react";
import {
  Card,
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

import { Eye } from "lucide-react";
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
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";

import ScheduleDetailsModal from "@/pages/schedules/components/ScheduleDetailsModal";

type Props = {
  codigoMatricula: number;
  value?: string;
};
export function DisciplinasSection({
  codigoMatricula: matricula,
  value = "disciplinas",
}: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [anoLetivo, setAnoLetivo] = useState<string | undefined>("23");

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const {
    data: student,
    isLoading,
    isFetching,
    error,
  } = useStudentDetail(matricula);

  const {
    data: response,
    isLoading: isDisciplinasLoading,
    isError,
  } = useStudentDisciplinas({
    matriculaId: matricula ?? "",
    anoLectivo: Number(anoLetivo),
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
    if (estado === "Fez com Sucesso") return "Aprovado";
    if (estado === "Pendente") return "Pendente";
    return estado;
  };

  return (
    <TabsContent value="disciplinas" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Disciplinas</CardTitle>
          <CardDescription>
            Lista de todas as disciplinas cursadas e em curso
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] max-w-[300px] w-full sm:w-auto">
              <FormSelect
                label="Ano Letivo"
                disabled={isLoadingAcademicYear}
                loading={isLoadingAcademicYear}
                value={anoLetivo ?? ""}
                onChange={(v) => setAnoLetivo(v)}
                options={anosAcademicos}
                map={(a) => ({
                  key: a.codigo,
                  label: a.designacao,
                  value: a.codigo,
                })}
              />
            </div>
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
                      <TableHead className="text-center">Estado</TableHead>
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
                          {disc.sala} • {disc.horario}
                          {disc.codigo_horario && (
                            <Button
                              variant="link"
                              size="sm"
                              className="ml-2"
                              onClick={() => openDetails(disc.codigo_horario!)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              disc.estado === "Aprovado"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {getEstadoLabel(disc.estado)}
                          </Badge>
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
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
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
      </Card>

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
