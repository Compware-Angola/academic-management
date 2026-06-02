import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight, Loader2 } from "lucide-react";
import { ScheduleMoveTable } from "./components/ScheduleMoveTable";
import { ScheduleMoveStudentCard } from "./components/ScheduleMoveStudentCard";
import { RegistrationDetailItem } from "@/services/horario/fetch-schedule-inscription-details.service";
import { Button } from "@/components/ui/button";
import { useMutationMoveStudents } from "@/hooks/horario/use-mutation-move-student";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { SelectUnidadeCurricular } from "@/components/common/global-selects/SelectUnidadeCurricular";
import { StudentWithoutScheduleCard } from "./components/StudentWithoutScheduleCard";

export function MoveStudentsWithoutSchedule() {
  //Hooks
  const { user } = useAuth();
  const moveStudentsMutation = useMutationMoveStudents(user.user.pk_utilizador);

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
 
  const canLoadUcs =
    !!filters.curso &&
    !!filters.semestre &&
    !!filters.anoCurricular &&
    !!filters.anoLetivo;
  !!filters.periodo;


  // === Consulta API ===
  const canLoadTurmas =
    !!filters.curso &&
    !!filters.semestre &&
    !!filters.anoCurricular &&
    !!filters.unidadeCurricular &&
    !!filters.anoLetivo;

  return (
      <div className="p-4 space-y-4">
          <p className="text-muted-foreground">
            Vincula estudantes aos horarios
          </p>
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Ano Letivo */}
              <AcademicYearSelect  
              enableDefaultActiveYear  
              onlyActive
              value={filters.anoLetivo} 
              onChangeValue={(v) => setFilters({ ...filters, anoLetivo: v })}/>
              <SemestreSelect 
              value={filters.semestre} 
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}/>
              <CourseSelect
                value={filters.curso}
                onChangeValue={(v) => {
                  setFilters({
                    ...filters,
                    curso: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  });
                }}
              />
              <AnoCurricularSelect
              value={filters.anoCurricular}
              disabled={!filters.curso}
              curso={filters.curso}
              onChangeValue={(v) => setFilters({ ...filters, anoCurricular: v })}/>
              <SelectUnidadeCurricular 
              value={filters.unidadeCurricular}
              disabled={!canLoadUcs}
              filter={{
                curso: filters.curso,
                semestre: filters.semestre,
                classe: filters.anoCurricular,
              }}
              onChangeValue={(v) => setFilters({ ...filters, unidadeCurricular: v })}/>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <Card>
            <StudentWithoutScheduleCard
              originScheduleId={selectedScheduleDestination}
              filters={filters}
              title="Estudantes sem horário na uc"
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
  );
}


