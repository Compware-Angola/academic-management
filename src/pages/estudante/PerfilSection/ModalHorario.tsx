import { HorarioSelect } from "@/components/common/global-selects/HorarioSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQueryScheduleDetails } from "@/hooks/horario/use-query-schedule-details";
import { Loader2, Save } from "lucide-react";
import { useMutationUpdateGradeCurricularHorarioAluno } from "@/hooks/students/use-Mutation-update-grade-curricular-horario-aluno";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type HorarioDetails = {
  codigo: string;
  disciplina: string;
  anoLectivo: string;
  curso: string;
  semestre: string;
  codigoGradeCurricular: string;
  estado: string;
  periodo?: string;
  classes: string;
};

export type ModalHorarioProps = {
  isOpen: boolean;
  horarionDetails: HorarioDetails | null;
  onClose: () => void;
};

export const ModalHorario = ({
  isOpen,
  horarionDetails,
  onClose,
}: ModalHorarioProps) => {
  const mutation = useMutationUpdateGradeCurricularHorarioAluno();
  const [horarioId, setHorarioId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    periodo: "",
  });
  const { data: periodos } = useQueryPeriod();
  const handleSave = () => {
    mutation.mutate({
      horarioID: horarioId!,
      codigoGradeCurricularAluno: Number(horarionDetails?.codigo!),
    });
    onClose();
  };

  // ✅ reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setHorarioId(null);
    }
  }, [isOpen]);

  const {
    data: horario,
    isLoading,
    isError,
  } = useQueryScheduleDetails(horarioId, {
    enabled: Boolean(isOpen && horarioId),
  });

  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const groupedByDay = daysOfWeek.reduce(
    (acc, day) => {
      const dayItems = (horario?.aulas || [])
        .filter((aula) => {
          const diaNome = aula.diaSemana.replace("-Feira", "");
          return diaNome === day;
        })
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

      if (dayItems.length > 0) acc[day] = dayItems;
      return acc;
    },
    {} as Record<string, typeof horario.aulas>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full xl:max-w-[1200px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {horarionDetails?.disciplina}
          </DialogTitle>

          <DialogDescription>
            Selecione o horário para {horarionDetails?.disciplina}
          </DialogDescription>
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select
              value={filters.periodo}
              onValueChange={(v) => setFilters({ ...filters, periodo: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
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

          <HorarioSelect
            value={horarioId?.toString()}
            onChangeValue={(v) => setHorarioId(v ? Number(v) : null)}
            anoLectivo={horarionDetails?.anoLectivo ?? ""}
            curso={horarionDetails?.curso ?? ""}
            semestre={horarionDetails?.semestre ?? ""}
            unidadeCurricular={horarionDetails?.codigoGradeCurricular ?? ""}
            estado={horarionDetails?.estado ?? ""}
            periodo={horarionDetails?.periodo ?? ""}
            classes={horarionDetails?.classes ?? ""}
          />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {/* ✅ estado inicial */}
          {!horarioId ? (
            <div className="text-center py-20 text-muted-foreground">
              Selecione um horário
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando horário...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Erro ao carregar o horário.
            </div>
          ) : horario.aulas.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              Nenhuma aula cadastrada
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {daysOfWeek.map((day) => {
                const dayItems = groupedByDay[day];

                return (
                  <div
                    key={day}
                    className={`rounded-xl border-2 bg-card shadow-md overflow-hidden transition-all ${dayItems
                      ? "border-primary/20 ring-2 ring-primary/10"
                      : "border-dashed border-muted-foreground/30 opacity-60"
                      }`}
                  >
                    {/* Cabeçalho do dia */}
                    <div
                      className={`px-5 py-3 font-bold text-lg text-center ${dayItems
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {day.substring(0, 3)}
                      <span className="block text-sm font-medium opacity-80">
                        {day}
                      </span>
                    </div>

                    {/* Aulas do dia */}
                    <div className="p-4 space-y-3 min-h-[120px]">
                      {dayItems ? (
                        dayItems.map((aula) => (
                          <div
                            key={aula.id}
                            className="rounded-lg bg-background border p-4 text-sm shadow-sm hover:shadow transition-shadow"
                          >
                            {/* Horário + Tipo */}
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-mono font-bold text-base">
                                {aula.horaInicio}–{aula.horaTermino}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${aula.tipoAula.includes("Teórica") ||
                                  aula.tipoAula.includes("Teorico")
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : aula.tipoAula.includes("Prática")
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                  }`}
                              >
                                {aula.tipoAula.replace("Teorico", "Teórico")}
                              </span>
                            </div>

                            {/* Detalhes */}
                            <div className="space-y-1.5 text-muted-foreground text-xs">
                              <div className="flex justify-between">
                                <span>Designação</span>
                                <span className="font-medium text-foreground">
                                  {horario.designacao}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span>Docente</span>
                                <span className="font-medium text-foreground truncate max-w-[140px]">
                                  {aula.docenteNome &&
                                    aula.docenteNome !== "Sem docente"
                                    ? aula.docenteNome
                                    : "—"}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span>Sala</span>
                                <span className="font-medium text-foreground">
                                  {aula.sala || "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Modalidade
                                </span>
                                <span className="font-semibold text-foreground">
                                  {aula.modalidade || "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground text-sm italic py-8">
                          Sem aula
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button disabled={!horarioId} onClick={handleSave}>
            <Save />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
