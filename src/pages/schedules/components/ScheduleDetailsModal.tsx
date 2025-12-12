import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ScheduleItem = {
  id: number;
  uc: string;
  codigo: string;
  curso: string;
  turma: string;
  docente: string;
  sala: string;
  dia: string;
  horario: string;
  tipo: string;
};

type ScheduleDetailsModalProps = {
  items: ScheduleItem[];
  isOpen: boolean;
  onClose: () => void;
};

export default function ScheduleDetailsModal({
  items,
  isOpen,
  onClose,
}: ScheduleDetailsModalProps) {
  if (items.length === 0) return null;

  const ucName = items[0].uc;
  const ucCode = items[0].codigo;

  const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  // Agrupa aulas por dia e ordena dentro de cada dia por horário
  const groupedByDay = daysOfWeek.reduce((acc, day) => {
    const dayItems = items
      .filter((item) => item.dia === day)
      .sort((a, b) => a.horario.localeCompare(b.horario));

    if (dayItems.length > 0) {
      acc[day] = dayItems;
    }
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  const hasClasses = Object.keys(groupedByDay).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">
            {ucName}{" "}
            <span className="text-muted-foreground font-mono">({ucCode})</span>
          </DialogTitle>
          <DialogDescription>
            Horário semanal completo da unidade curricular
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          {hasClasses ? (
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
                      <span className="block text-sm font-medium opacity-80">
                        {day}
                      </span>
                    </div>

                    {/* Lista de aulas do dia */}
                    <div className="p-4 space-y-3 min-h-[120px]">
                      {dayItems ? (
                        dayItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-background border p-4 text-sm shadow-sm hover:shadow transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-mono font-bold text-base">
                                {item.horario}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  item.tipo === "Teórica"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                    : item.tipo === "Prática"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                }`}
                              >
                                {item.tipo}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Turma</span>
                                <span className="font-medium text-foreground">
                                  {item.turma}
                                </span>
                              </div>
                              {item.docente && (
                                <div className="flex justify-between">
                                  <span>Docente</span>
                                  <span className="font-medium text-foreground truncate max-w-[120px]">
                                    {item.docente}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Sala</span>
                                <span className="font-medium text-foreground">
                                  {item.sala || "—"}
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma aula cadastrada para esta UC.
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}