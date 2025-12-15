import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, MoveRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { ScheduleMoveTable } from "./components/ScheduleMoveTable";
import { ScheduleMoveStudentCard } from "./components/ScheduleMoveStudentCard";
import { RegistrationDetailItem } from "@/services/horario/fetch-schedule-inscription-details.service";
import { Button } from "@/components/ui/button";
import { useMutationMoveStudents } from "@/hooks/horario/use-mutation-move-student";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function MovimentarEstudantes() {
  //Hooks
  const { user } = useAuth();
  const moveStudentsMutation = useMutationMoveStudents(user.user_id);

  const [selectedSchedule, setSelectedSchedule] = useState<number | undefined>(
    undefined
  );
  const [selectedScheduleDestination, setSelectedScheduleDestination] =
    useState<number | undefined>(undefined);
  const [selectedStudents, setSelectedStudents] = useState<
    RegistrationDetailItem[]
  >([]);

  // const [movedStudents, setMovedStudents] = useState<RegistrationDetailItem[]>(
  //   []
  // );

  const handleToggleStudent = (student: RegistrationDetailItem) => {
    setSelectedStudents((prev) => {
      const exists = prev.some(
        (s) => s.numero_de_matricula === student.numero_de_matricula
      );

      return exists
        ? prev.filter(
            (s) => s.numero_de_matricula !== student.numero_de_matricula
          )
        : [...prev, student];
    });
  };

  const handleToggleSelectedAllStudents = (
    students: RegistrationDetailItem[]
  ) => {
    setSelectedStudents((prev) => {
      if (students.length === 0) {
        return [];
      }
      const newStudents = students.filter(
        (student) =>
          !prev.some(
            (s) => s.numero_de_matricula === student.numero_de_matricula
          )
      );
      return [...prev, ...newStudents];
    });
  };
  const getSelectedStudentMatriculas = (students): number[] => {
    return students.map((student) => student.numero_de_matricula);
  };
  const moveScheduleStudent = () => {
    if (!selectedSchedule || !selectedScheduleDestination) {
      toast.error("Selecione os horários");
      return;
    }

    moveStudentsMutation.mutate(
      {
        studentsCurriculumIds: selectedStudents.map(
          (student) => student.codigo_grade_aluno
        ),
        fromScheduleId: selectedSchedule,
        toScheduleId: selectedScheduleDestination,
      },
      {
        onSuccess: () => {
          // setMovedStudents((prev) => {
          //   const novos = selectedStudents.filter(
          //     (student) =>
          //       !prev.some(
          //         (s) => s.numero_de_matricula === student.numero_de_matricula
          //       )
          //   );

          //   return [...prev, ...novos];
          // });

          setSelectedStudents([]);
        },
      }
    );
  };
  // === Filtros ===
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });
  // === Dados base ===
  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: cursos } = useCursos();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const canLoadUcs =
    !!filters.curso &&
    !!filters.semestre &&
    !!filters.anoCurricular &&
    !!filters.anoLetivo;
  !!filters.periodo;
  const { data: unidadesCurriculares = [] } = useQueryDisciplinaWithFilter({
    curso: filters.curso,
    semestre: filters.semestre,
    classe: filters.anoCurricular,
  });

  // === Consulta API ===
  const canLoadTurmas =
    !!filters.curso &&
    !!filters.semestre &&
    !!filters.anoCurricular &&
    !!filters.unidadeCurricular &&
    !!filters.anoLetivo;

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Horários</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Movimentar Estudantes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-2xl font-bold">
            Movimentar Estudantes entre Horários
          </h1>
          <p className="text-muted-foreground">
            Transferir estudantes de um horário para outro da mesma UC.
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Ano Letivo */}
              <Select
                value={filters.anoLetivo}
                onValueChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ano Lectivo" />
                </SelectTrigger>
                <SelectContent>
                  {anosAcademicos?.map((a) => (
                    <SelectItem key={a.codigo} value={a.codigo.toString()}>
                      {a.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Semestre */}
              <Select
                value={filters.semestre}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    semestre: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestres?.map((s) => (
                    <SelectItem key={s.codigo} value={s.codigo.toString()}>
                      {s.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Curso */}
              <Select
                value={filters.curso}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    curso: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos?.map((c) => (
                    <SelectItem key={c.codigo} value={c.codigo.toString()}>
                      {c.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ano Curricular */}
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    anoCurricular: v,
                    unidadeCurricular: "",
                  })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      filters.curso ? "Selcione o Ano" : "Selecione curso"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {anosCurriculares.map((ac) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                      {ac.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Unidade Curricular */}
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unidade Curricular" />
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
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <ScheduleMoveTable
              originScheduleId={selectedScheduleDestination}
              filters={filters}
              title="Horário de Origem"
              onChangeSchedule={(scheduleId) => {
                setSelectedSchedule(scheduleId);
                setSelectedStudents([]);
                //setMovedStudents([]);
              }}
            />
            <div className="px-6 pb-6">
              <ScheduleMoveStudentCard
                onHandleToggleSelecteAll={(students) =>
                  handleToggleSelectedAllStudents(students)
                }
                scheduleId={selectedSchedule}
                handleToggleStudent={(student) => handleToggleStudent(student)}
                selectedStudents={getSelectedStudentMatriculas(
                  selectedStudents
                )}
                //movedStudents={getSelectedStudentMatriculas(movedStudents)}
              />
            </div>
          </Card>
          <Card>
            <ScheduleMoveTable
              originScheduleId={selectedSchedule}
              filters={filters}
              title="Horário de Destino"
              onChangeSchedule={(scheduleId) => {
                setSelectedScheduleDestination(scheduleId);
              }}
            />
            <div className="mt-4 p-4 bg-muted/50 rounded-lg"></div>

            <div className="px-6 pb-6">
              <ScheduleMoveStudentCard
                isMovedCard={true}
                scheduleId={selectedScheduleDestination}
                handleToggleStudent={(student) => {}}
                selectedStudents={[]}
                //movedStudents={[]}
              />
            </div>
          </Card>
        </div>
        <div>
          <div className="flex justify-end">
            <Button
              disabled={
                selectedStudents.length == 0 ||
                selectedScheduleDestination == undefined ||
                moveStudentsMutation.isPending
              }
              size="lg"
              onClick={() => moveScheduleStudent()}
              className="gap-2"
            >
              {moveStudentsMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />A movimentar que
                  os estudantes...
                </>
              ) : (
                <>
                  <MoveRight className="h-5 w-5" />
                  Movimentar {selectedStudents.length} Estudante(s)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
