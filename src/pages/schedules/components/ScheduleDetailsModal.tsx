// src/components/ScheduleDetailsModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQueryScheduleDetails } from "@/hooks/horario/use-query-schedule-details";

type ScheduleDetailsModalProps = {
  horarioId: number | null;   // ID da turma/horário
  isOpen: boolean;
  onClose: () => void;
};

// Converte .NET ticks (100ns) → HH:mm
const formatTime = (ticks: string): string => {
  const totalSeconds = Number(ticks) / 10_000_000; // 1 tick = 100ns
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export default function ScheduleDetailsModal({
  horarioId,
  isOpen,
  onClose,
}: ScheduleDetailsModalProps) {
  const { data: horario, isLoading, isError } = useQueryScheduleDetails(horarioId, {
    enabled: isOpen && !!horarioId,
  });

  const closeModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  // Agrupa aulas por dia
  const groupedByDay = daysOfWeek.reduce((acc, day) => {
    const dayItems = (horario?.aulas || [])
      .filter((aula) => {
        const diaNome = aula.diaSemana.replace("-Feira", ""); // "Sexta-Feira" → "Sexta"
        return diaNome === day;
      })
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    if (dayItems.length > 0) acc[day] = dayItems;
    return acc;
  }, {} as Record<string, typeof horario.aulas>);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">
            {horario?.unidadeCurricular || "Carregando..."}{" "}
            <span className="text-muted-foreground font-mono text-lg">
              ({horario?.designacao || "..."})
            </span>
          </DialogTitle>
          <DialogDescription>
            {horario
              ? `Horário semanal completo • Turma ${horario.designacao} • ${horario.curso} • ${horario.ano}`
              : "Carregando detalhes do horário..."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando horário...</p>
            </div>
          ) : isError || !horario ? (
            <div className="text-center py-20 text-destructive">
              Erro ao carregar o horário da turma.
            </div>
          ) : horario.aulas.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Nenhuma aula cadastrada para esta turma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {daysOfWeek.map((day) => {
                const dayItems = groupedByDay[day];

                return (
                  <div
                    key={day}
                    className={`rounded-xl border-2 bg-card shadow-md overflow-hidden transition-all ${
                      dayItems
                        ? "border-primary/20 ring-2 ring-primary/10"
                        : "border-dashed border-muted-foreground/30 opacity-60"
                    }`}
                  >
                    {/* Cabeçalho do dia */}
                    <div
                      className={`px-5 py-3 font-bold text-lg text-center ${
                        dayItems
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day.substring(0, 3)}
                      <span className="block text-sm font-medium opacity-80">{day}</span>
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
                                {formatTime(aula.horaInicio)}–{formatTime(aula.horaTermino)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  aula.tipoAula.includes("Teórica") || aula.tipoAula.includes("Teorico")
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
                                <span className="font-medium text-foreground">{horario.designacao}</span>
                              </div>

                              {/* Docente: sempre mostra (se não tiver, aparece "—") */}
                              <div className="flex justify-between">
                                <span>Docente</span>
                                <span className="font-medium text-foreground truncate max-w-[140px]">
                                  {aula.docenteNome && aula.docenteNome !== "Sem docente" ? aula.docenteNome : "—"}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span>Sala</span>
                                <span className="font-medium text-foreground">{aula.sala || "—"}</span>
                              </div>
                                <div className="flex justify-between">
                                <span className="text-muted-foreground">Modalidade</span>
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

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={closeModal} size="lg">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}