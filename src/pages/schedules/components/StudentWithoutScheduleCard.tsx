import { useQueryRegistrationBySchedule } from "@/hooks/horario/use-query-schedule-inscription";
import { RegistrationScheduleItem } from "@/services/horario/fetch-schedule-inscription.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import ScheduleDetailsModal from "./ScheduleDetailsModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, BookOpen } from "lucide-react";

interface StudentWithoutScheduleCardProps {
  onChangeSchedule(scheduleId: number): void;
  originScheduleId?: number;
  title: string;
  filters: {
    anoLetivo: string;
    semestre: string;
    curso: string;
    anoCurricular: string;
    unidadeCurricular: string;
  };
}
export const StudentWithoutScheduleCard = ({
  onChangeSchedule,
  filters,
  title,
  originScheduleId,
}: StudentWithoutScheduleCardProps) => {
  const { data: periodos } = useQueryPeriod();

  const [horarioOrigemId, setHorarioOrigemId] = useState<number | null>(null);
  [] > [];
  const [periodo, setPeriodo] = useState<string>("");
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };

  const handleSelecionarHorarioOrigem = (id: number) => {
    if (originScheduleId) {
      if (originScheduleId == id) {
        toast.error(
          "Não é permitido selecionar o mesmo horário de origem e destino."
        );
        return;
      }
    }
    setHorarioOrigemId(id);
    onChangeSchedule(id);
  };
  // === Consulta API ===
  const canLoadTurmas =
    !!filters.curso &&
    !!filters.semestre &&
    !!filters.anoCurricular &&
    !!filters.unidadeCurricular &&
    !!periodo;
  !!filters.anoLetivo;
  const { data: turmasResponse, isLoading: loadingTurmas } =
    useQueryRegistrationBySchedule(
      {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        periodo: Number(periodo),
        curso: Number(filters.curso),
        anoCurricular: Number(filters.anoCurricular),
        unidadeCurricular: Number(filters.unidadeCurricular),
      },
      { enabled: canLoadTurmas }
    );

  const tableData: RegistrationScheduleItem[] = turmasResponse?.data || [];
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5" /> {title}
          </CardTitle>
        
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingTurmas ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando horários...</p>
          </div>
        ) : tableData.length === 0 ? (
          <>
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                {canLoadTurmas
                  ? "Nenhum horário disponível para os filtros selecionados."
                  : "Selecione todos os filtros para visualizar os horários disponíveis."}
              </p>
            </div>
          </>
        ) : (
          <div className="max-h-[320px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Estudantes</TableHead>
                  <TableHead>Ações </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((horario) => (
                  <TableRow
                    key={horario.codigo}
                    className={`cursor-pointer transition-colors ${
                      horarioOrigemId === horario.codigo ? "bg-primary/10" : ""
                    } ${
                      originScheduleId === horario.codigo
                        ? "line-through opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelecionarHorarioOrigem(horario.codigo)
                    }
                  >
                    <TableCell>
                      <input
                        type="radio"
                        checked={horarioOrigemId === horario.codigo}
                        onChange={() =>
                          handleSelecionarHorarioOrigem(horario.codigo)
                        }
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>{horario.curso}</TableCell>
                    <TableCell>{horario.capacidade}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{horario.total_alunos}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetails(horario.codigo)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Ver Horário
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />
    </>
  );
};
