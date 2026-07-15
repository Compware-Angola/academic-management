import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { MoveRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { StudentWithoutScheduleCard } from "./components/StudentWithoutScheduleCard";
import { ScheduleMoveTableWithFilters } from "./components/ScheduleMoveTableWithFilters";
import { useRepairScheduleMutation } from "@/hooks/horario/use-repair-schedule-mutation";
import { ScheduleMoveStudentCard } from "./components/ScheduleMoveStudentCard";

export function MoveStudentsWithoutSchedule() {
  const { mutateAsync: repairSchedule, isPending: repairSchedulePending } =
    useRepairScheduleMutation();
  const [selectedGradeAlunoIds, setSelectedGradeAlunoIds] = useState<number[]>(
    [],
  );
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [course, setCourse] = useState<string>("");
  const [filters, setFilters] = useState({
    tipoCandidatura: "1",
    anoLetivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });

  const handeleChangeCourse = (course: string) => {
    setCourse(course);
  };
  const handleRepairSchedule = async () => {
    if (!selectedSchedule) {
      toast.error("Selecione o horario");
      return;
    }
    if (!selectedGradeAlunoIds.length) {
      toast.error("Selecione os estudantes");
      return;
    }
    await repairSchedule({
      toScheduleId: selectedSchedule,
      studentsCurriculumIds: selectedGradeAlunoIds,
    });
    //handleResetShedule();
    setSelectedGradeAlunoIds([]);
  };
  const handleResetShedule = useCallback(() => {
    setSelectedSchedule(null);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <p className="text-muted-foreground">Vincula estudantes aos horarios</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card>
          <StudentWithoutScheduleCard
            title="Estudantes sem horário"
            selectedGradeAlunoIds={selectedGradeAlunoIds}
            onChangeGradeAluno={setSelectedGradeAlunoIds}
            onChangeCourse={handeleChangeCourse}
            onFilterChange={(v) => setFilters(v)}
          />
        </Card>
        <Card>
          <ScheduleMoveTableWithFilters
            originScheduleId={selectedSchedule}
            filters={filters}
            title="Horário de Destino"
            onChangeSchedule={(scheduleId) => {
              setSelectedSchedule(scheduleId);
            }}
            course={course}
            onResetSchedule={handleResetShedule}
          />
          <ScheduleMoveStudentCard
            isMovedCard={true}
            scheduleId={selectedSchedule}
            handleToggleStudent={(student) => {}}
            selectedStudents={[]}
            //movedStudents={[]}
          />
        </Card>
      </div>
      <div>
        <div className="flex justify-end">
          <Button
            disabled={
              selectedGradeAlunoIds.length == 0 ||
              selectedSchedule == null ||
              repairSchedulePending
            }
            size="lg"
            onClick={() => handleRepairSchedule()}
            className="gap-2"
          >
            {repairSchedulePending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />A movimentar que os
                estudantes...
              </>
            ) : (
              <>
                <MoveRight className="h-5 w-5" />
                Movimentar {selectedGradeAlunoIds.length} Estudante(s)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
