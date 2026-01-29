import { useState } from "react";
import { Clock, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DiaSemana,
  Tempo,
  TempoDisponivelItem,
} from "@/services/tempos/tempos-disponiveis";
import { AulaPayload } from "@/services/horario/save-horario.service";
import { useToast } from "@/hooks/use-toast";

type SlotKey = string;

type ScheduleGridProps = {
  ocupadas: Set<string>;
  scheduleData: TempoDisponivelItem[];
  onChange: (aulas: AulaPayload[]) => void;
};

export default function ScheduleGrid({
  ocupadas,
  scheduleData,
  onChange,
}: ScheduleGridProps) {
  const { toast } = useToast();

  const [slotData, setSlotData] = useState<Record<SlotKey, AulaPayload>>({});
  const isOcupada = (diaId: number, ordem: number) =>
    ocupadas.has(`${diaId}-${ordem}`);

  /* ---------- FUNÇÕES ---------- */

  const toggleAllForDay = (dia: DiaSemana, tempos: Tempo[]) => {
    const updated = { ...slotData };

    // Pegando somente os tempos disponíveis (não ocupados)
    const temposDisponiveis = tempos.filter(
      (tempo) => !isOcupada(dia.pkDiaDaSemana, tempo.ordem),
    );

    if (temposDisponiveis.length === 0) {
      // Nenhum tempo disponível → não faz nada
      toast({
        variant: "destructive",
        title: "Dia cheio",
        description: `Todos os tempos de ${dia.designacao} estão ocupados.`,
      });
      return;
    }

    // Verifica se todos os tempos disponíveis já estão selecionados
    const allDisponiveisSelected = temposDisponiveis.every((tempo) =>
      Boolean(updated[`${dia.pkDiaDaSemana}-${tempo.ordem}`]),
    );

    if (allDisponiveisSelected) {
      // Remove todos os selecionados
      temposDisponiveis.forEach((tempo) => {
        const key = `${dia.pkDiaDaSemana}-${tempo.ordem}`;
        delete updated[key];
      });

      toast({
        title: "Todos desmarcados",
        description: `Todos os tempos disponíveis de ${dia.designacao} foram removidos.`,
      });
    } else {
      // Adiciona todos os tempos disponíveis
      temposDisponiveis.forEach((tempo) => {
        const key = `${dia.pkDiaDaSemana}-${tempo.ordem}`;
        if (!updated[key]) {
          updated[key] = {
            diaSemana: dia.pkDiaDaSemana,
            ordemTempo: tempo.ordem,
            hora_inicio: tempo.horaInicio,
            hora_fim: tempo.horaFim,
            obs: "",
          };
        }
      });

      toast({
        title: "Todos selecionados",
        description: `Todos os tempos disponíveis de ${dia.designacao} foram adicionados.`,
      });
    }

    setSlotData(updated);
    onChange(Object.values(updated));
  };

  const hasData = (diaId: number, ordem: number) =>
    Boolean(slotData[`${diaId}-${ordem}`]);

  const days = scheduleData.filter((item) => item.diaSemana);
  const toggleSlot = (dia: DiaSemana, tempo: Tempo) => {
    const key = `${dia.pkDiaDaSemana}-${tempo.ordem}`;

    if (isOcupada(dia.pkDiaDaSemana, tempo.ordem)) {
      toast({
        variant: "destructive",
        title: "Sala ocupada",
        description: "Não é possível marcar este horário.",
      });
      return;
    }

    // Se já está selecionado → remove
    if (slotData[key]) {
      const updated = { ...slotData };
      delete updated[key];
      setSlotData(updated);
      onChange(Object.values(updated));

      toast({
        title: "Aula removida",
        description: "Tempo removido do horário.",
      });
      return;
    }

    // Se não está → adiciona
    const novaAula: AulaPayload = {
      diaSemana: dia.pkDiaDaSemana,
      ordemTempo: tempo.ordem,
      hora_inicio: tempo.horaInicio,
      hora_fim: tempo.horaFim,
      obs: "",
    };

    const updated = { ...slotData, [key]: novaAula };
    setSlotData(updated);
    onChange(Object.values(updated));

    toast({
      title: "Aula adicionada",
      description: "Tempo adicionado ao horário.",
    });
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {days.map((item) => (
        <Card
          key={item.diaSemana.pkDiaDaSemana}
          className="rounded-none border-0"
        >
          <CardHeader className="bg-linear-to-r from-primary to-primary text-white flex justify-between items-center">
            <CardTitle className="text-center text-sm">
              {item.diaSemana.designacao}
            </CardTitle>

            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => toggleAllForDay(item.diaSemana, item.tempos)}
                className={`w-full justify-start h-auto py-3 transition ${
                  hasData(item.diaSemana.pkDiaDaSemana, item.tempos[0].ordem) &&
                  item.tempos.every((tempo) =>
                    hasData(item.diaSemana.pkDiaDaSemana, tempo.ordem),
                  )
                    ? "bg-green-50 text-green-900 hover:bg-green-100"
                    : "bg-white text-muted-foreground hover:bg-gray-50"
                }`}
              >
                {item.tempos.every((tempo) =>
                  hasData(item.diaSemana.pkDiaDaSemana, tempo.ordem),
                ) ? (
                  <>
                    <CheckSquare size={16} className="mr-1" />
                    Desmarcar Todos
                  </>
                ) : (
                  <>
                    <Square size={16} className="mr-1" />
                    Selecionar Todos
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-3 space-y-2">
            {item.tempos.map((tempo) => {
              const filled = hasData(item.diaSemana.pkDiaDaSemana, tempo.ordem);
              console.log({ filled });
              const ocupada = isOcupada(
                item.diaSemana.pkDiaDaSemana,
                tempo.ordem,
              );

              return (
                <Button
                  key={tempo.ordem}
                  type="button"
                  disabled={ocupada}
                  onClick={() => toggleSlot(item.diaSemana, tempo)}
                  variant={filled ? "default" : "outline"}
                  className={`w-full justify-start h-auto py-3 transition ${
                    ocupada
                      ? "bg-red-100 text-red-700 cursor-not-allowed"
                      : filled
                        ? "bg-green-50 text-green-900 hover:bg-green-100"
                        : ""
                  }`}
                >
                  <Clock
                    size={16}
                    className={
                      ocupada
                        ? "text-red-600"
                        : filled
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }
                  />
                  <span className="ml-2 text-sm font-semibold">
                    {tempo.horaInicio} - {tempo.horaFim}
                  </span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
