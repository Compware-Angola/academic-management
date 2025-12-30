import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryRegistrationDetailsBySchedule } from "@/hooks/horario/use-query-schedule-inscription-details";
import { RegistrationDetailItem } from "@/services/horario/fetch-schedule-inscription-details.service";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, BookOpen, Users } from "lucide-react";

interface ScheduleMoveSudentCardProps {
  isMovedCard?: boolean;
  scheduleId: number;
  selectedStudents: number[];
  onHandleToggleSelecteAll?(students: RegistrationDetailItem[]);
  //movedStudents: number[];
  handleToggleStudent(student: RegistrationDetailItem): void;
}
export const ScheduleMoveStudentCard = ({
  scheduleId,
  handleToggleStudent,
  selectedStudents,
  //movedStudents,
  onHandleToggleSelecteAll,
  isMovedCard = false,
}: ScheduleMoveSudentCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useQueryRegistrationDetailsBySchedule(
    {
      scheduleId,
    },
    {
      enabled: !!scheduleId,
    }
  );

  const tableData: RegistrationDetailItem[] = data ?? [];
  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;

    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const normalizedSearch = normalize(searchTerm);

    return tableData.filter((student) =>
      normalize(student.nome_completo).includes(normalizedSearch)
    );
  }, [searchTerm, tableData]);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">
            Carregando estudantes...
          </p>
        </div>
      ) : tableData.length == 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Users className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm text-center">
            {!scheduleId
              ? "Selecione um horário para visualizar os estudantes."
              : searchTerm
              ? "Nenhum estudante corresponde à pesquisa."
              : isMovedCard
              ? "Nenhum estudante movido para este horário."
              : "Nenhum estudante disponível neste horário."}
          </p>
        </div>
      ) : (
        <div className="mt-4 border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">
              Estudantes no Horário ({tableData.length})
            </h4>
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Pesquisar por aluno"
                className="pl-8 w-full bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <>
                {!isMovedCard && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onHandleToggleSelecteAll(filteredData)}
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onHandleToggleSelecteAll([])}
                    >
                      Desmarcar Todos
                    </Button>
                  </>
                )}
              </>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredData.map((student) => (
              <div
                key={student.numero_de_matricula}
                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedStudents.includes(student.numero_de_matricula)
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleToggleStudent(student)}
              >
                {!isMovedCard && (
                  <Checkbox
                    checked={selectedStudents.includes(
                      student.numero_de_matricula
                    )}
                    onCheckedChange={() => handleToggleStudent(student)}
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{student.nome_completo}</p>
                  <p className="text-xs text-muted-foreground">
                    Nº {student.numero_de_matricula}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedStudents.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium text-primary">
                {selectedStudents.length} estudante(s) selecionado(s)
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
