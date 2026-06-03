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
import { useEffect, useState } from "react";
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
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { SelectUnidadeCurricularWithFilter } from "@/components/common/global-selects/SelectUnidadeCurricularWithFilter";
import { Label } from "@/components/ui/label";

interface ScheduleMoveTableProps {
  onChangeSchedule(scheduleId: number): void;
  originScheduleId?: number;
  title: string;
  course: string;
  onResetSchedule: () => void
}
export const ScheduleMoveTableWithFilters = ({
  onChangeSchedule,
  title,
  originScheduleId,
  course,
  onResetSchedule
}: ScheduleMoveTableProps) => {
  const { data: periodos } = useQueryPeriod();
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });
  console.log({ filters }, "curso");
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

  useEffect(() => {
    onResetSchedule();
  }, [filters, periodo, course]);

  const canLoadTurmas =

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
        curso: Number(course),
        anoCurricular: Number(filters.anoCurricular),
        unidadeCurricular: Number(filters.unidadeCurricular),
      },
      { enabled: canLoadTurmas }
    );

  const tableData: RegistrationScheduleItem[] = turmasResponse?.data || [];
  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      semestre: "",
      curso: "",
      anoCurricular: "",
      unidadeCurricular: "",

    }));
  };
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> {title}
        </CardTitle>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AcademicYearSelect
            enableDefaultActiveYear
            onlyActive
            value={filters.anoLetivo}
            onChangeValue={(v) =>
              setFilters({ ...filters, anoLetivo: v })
            }
          />

          <SemestreSelect
            value={filters.semestre}
            onChangeValue={(v) =>
              setFilters({ ...filters, semestre: v })
            }
          />

          <CourseSelect
            disabled
            value={course}
            onChangeValue={(v) =>
              setFilters({
                ...filters,

              })
            }
          />

          <AnoCurricularSelect
            value={filters.anoCurricular}
            disabled={!!course === false}
            curso={course}
            onChangeValue={(v) =>
              setFilters({ ...filters, anoCurricular: v })
            }
          />

          <SelectUnidadeCurricularWithFilter
            onChangeValue={(v) => setFilters({ ...filters, unidadeCurricular: v })}
            value={filters.unidadeCurricular}
            filter={{ classe: filters.anoCurricular, curso: course, semestre: filters.semestre }}
            disabled={!!course === false || !filters.semestre || !filters.anoCurricular}
          />
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={periodo} onValueChange={(v) => setPeriodo(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {periodos?.map((p) => (
                  <SelectItem key={p.codigo} value={p.codigo.toString()}>
                    {p.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={handleResetFilters}
          >
            Limpar Filtros
          </Button>
        </div>


      </div>


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
                <TableHead>Horário</TableHead>
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
                  className={`cursor-pointer transition-colors ${horarioOrigemId === horario.codigo ? "bg-primary/10" : ""
                    } ${originScheduleId === horario.codigo
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
                  <TableCell>{horario.designacao}</TableCell>
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

      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />
    </div >
  );
};
