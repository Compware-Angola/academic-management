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

  // Exemplo de como seria a lógica dentro do seu componente
  const handleTrocarHorario = async (
    disciplinaId: number,
    novoHorarioId: string,
  ) => {
    try {
      // 1. Chame seu serviço/hook de atualização
      // await updateStudentHorario({ disciplinaId, novoHorarioId });

      console.log(
        `Trocando disciplina ${disciplinaId} para o horário ${novoHorarioId}`,
      );

      // 2. Feedback visual
      // toast.success("Horário atualizado com sucesso!");

      // 3. Opcional: Recarregar os dados para o Select refletir o novo valor
      // queryClient.invalidateQueries(['student-disciplinas']);
    } catch (error) {
      // toast.error("Erro ao trocar horário");
    }
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
                          <HorarioSelect
                            value={disc.codigo_horario?.toString() || ""}
                            onChangeValue={(novoId) => {
                              handleTrocarHorario(
                                Number(disc.codigo_disciplina),
                                novoId,
                              );
                            }}
                            showDetails={true}
                            anoLectivo={filter.anoLetivo}
                            curso={student?.curso_codigo.toString()}
                            periodo={student?.periodo_codigo.toString()}
                            semestre={filter.semestre}
                            unidadeCurricular={disc.codigo_grade_curricular.toString()}
                            estado={"3"}
                          />
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
    </TabsContent>
  );
}
