import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegistrationDetailItem } from "@/services/horario/fetch-schedule-inscription-details.service";

interface ScheduleMovedSudentProps {
  data: RegistrationDetailItem[];
  handleToggleStudent(student: RegistrationDetailItem): void;
}
export const ScheduleMovedStudent = ({
  data,
  handleToggleStudent,
}: ScheduleMovedSudentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

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
            <Button variant="outline" size="sm">
              Remover
            </Button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredData.map((student) => (
            <div
              key={student.numero_de_matricula}
              className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors hover:bg-muted `}
              onClick={() => handleToggleStudent(student)}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{student.nome_completo}</p>
                <p className="text-xs text-muted-foreground">
                  Nº {student.numero_de_matricula}
                </p>
              </div>
            </div>
          ))}
        </div>

        {tableData.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm font-medium text-primary">
              {tableData.length} estudante(s) Movido(s)
            </p>
          </div>
        )}
      </div>
    </>
  );
};
