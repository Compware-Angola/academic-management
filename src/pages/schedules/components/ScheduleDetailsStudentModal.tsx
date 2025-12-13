import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useQueryRegistrationDetailsBySchedule } from "@/hooks/horario/use-query-schedule-inscription-details";
import { mapStudent, ScheduleStudentCard } from "./ScheduleStudentCard";
import { RegistrationScheduleItem } from "@/services/horario/fetch-schedule-inscription.service";
import { RegistrationDetailItem } from "@/services/horario/fetch-schedule-inscription-details.service";

type ScheduleDetailsStudentModalProps = {
  item: RegistrationScheduleItem;
  isOpen: boolean;
  onClose: () => void;
};

export default function ScheduleDetailsSchoolModal({
  item,
  isOpen,
  onClose,
}: ScheduleDetailsStudentModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useQueryRegistrationDetailsBySchedule(
    {
      scheduleId: item.codigo,
    },
    {
      enabled: isOpen && !!item.codigo,
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

  const closeModal = () => {
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">
            {item?.unidadecurricular || "Carregando..."}{" "}
            <span className="text-muted-foreground font-mono text-lg">
              ({item?.designacao || "..."})
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar por aluno"
              className="pl-8 w-full bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DialogDescription>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando horário...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Erro ao carregar os alunos.
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Nenhum aluno encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {filteredData.map((student) => (
                <ScheduleStudentCard
                  key={student.codigo_grade_aluno}
                  item={mapStudent(student)}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={closeModal} size="lg">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
