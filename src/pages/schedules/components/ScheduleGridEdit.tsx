import { useEffect, useState } from "react";
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

type ScheduleGridEditProps = {
  ocupadas: Set<string>;
  scheduleData: TempoDisponivelItem[];
  aulasExistentes: AulaPayload[];
  onChange: (aulas: AulaPayload[]) => void;
};

export default function ScheduleGridEdit({
  ocupadas,
  scheduleData,
  aulasExistentes,
  onChange,
}: ScheduleGridEditProps) {
  const { toast } = useToast();
  const [slotData, setSlotData] = useState<Record<SlotKey, AulaPayload>>({});
  const isOcupada = (
    diaId: number,
    ordem: number,
    horaInicio: string,
    horaFim: string,
  ) => ocupadas.has(`${diaId}-${ordem}-${horaInicio}-${horaFim}`);

  useEffect(() => {
    const initial: Record<SlotKey, AulaPayload> = {};

    aulasExistentes.forEach((aula) => {
      const key = `${aula.diaSemana}-${aula.ordemTempo}-${aula.hora_inicio}-${aula.hora_fim}`;
      initial[key] = aula;
    });

    setSlotData(initial);
  }, [aulasExistentes]);

  const toggleSlot = (dia: DiaSemana, tempo: Tempo) => {
    const key = `${dia.pkDiaDaSemana}-${tempo.ordem}-${tempo.horaInicio}-${tempo.horaFim}`;

    if (
      isOcupada(dia.pkDiaDaSemana, tempo.ordem, tempo.horaInicio, tempo.horaFim)
    ) {
      toast({
        variant: "destructive",
        title: "Sala ocupada",
        description: "Não é possível marcar este horário.",
      });
      return;
    }

    const updated = { ...slotData };

    if (updated[key]) {
      delete updated[key];
      toast({
        title: "Tempo removido",
        description: `${dia.designacao} ${tempo.horaInicio} removido.`,
      });
    } else {
      updated[key] = {
        diaSemana: dia.pkDiaDaSemana,
        ordemTempo: tempo.ordem,
        hora_inicio: tempo.horaInicio,
        hora_fim: tempo.horaFim,
        obs: "",
      };
      toast({
        title: "Tempo adicionado",
        description: `${dia.designacao} ${tempo.horaInicio} adicionado.`,
      });
    }

    setSlotData(updated);
    onChange(Object.values(updated));
  };

  const toggleAllForDay = (dia: DiaSemana, tempos: Tempo[]) => {
    const updated = { ...slotData };

    const temposDisponiveis = tempos.filter(
      (tempo) =>
        !isOcupada(
          dia.pkDiaDaSemana,
          tempo.ordem,
          tempo.horaInicio,
          tempo.horaFim,
        ),
    );

    if (temposDisponiveis.length === 0) {
      toast({
        variant: "destructive",
        title: "Dia cheio",
        description: `Todos os tempos de ${dia.designacao} estão ocupados.`,
      });
      return;
    }

    const allSelected = temposDisponiveis.every((tempo) =>
      Boolean(updated[`${dia.pkDiaDaSemana}-${tempo.ordem}`]),
    );

    if (allSelected) {
      temposDisponiveis.forEach((tempo) => {
        delete updated[`${dia.pkDiaDaSemana}-${tempo.ordem}`];
      });
    } else {
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
    }

    setSlotData(updated);
    onChange(Object.values(updated));
  };

  const hasData = (
    diaId: number,
    ordem: number,
    horaInicio: string,
    horaFim: string,
  ) => Boolean(slotData[`${diaId}-${ordem}-${horaInicio}-${horaFim}`]);

  const days = scheduleData.filter((item) => item.diaSemana);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {days.map((item) => {
        const allSelected = item.tempos.every((tempo) =>
          hasData(
            item.diaSemana.pkDiaDaSemana,
            tempo.ordem,
            tempo.horaInicio,
            tempo.horaFim,
          ),
        );

        return (
          <Card
            key={item.diaSemana.pkDiaDaSemana}
            className="border-0 rounded-none"
          >
            <CardHeader className="bg-primary text-white flex justify-between items-center">
              <CardTitle className="text-sm">
                {item.diaSemana.designacao}
              </CardTitle>

              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => toggleAllForDay(item.diaSemana, item.tempos)}
                className={
                  allSelected
                    ? "bg-green-50 text-green-900"
                    : "bg-white text-muted-foreground"
                }
              >
                {allSelected ? (
                  <>
                    <CheckSquare size={16} className="mr-1" />
                    Desmarcar
                  </>
                ) : (
                  <>
                    <Square size={16} className="mr-1" />
                    Marcar
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="p-3 space-y-2 rounded-none">
              {item.tempos.map((tempo) => {
                const filled = hasData(
                  item.diaSemana.pkDiaDaSemana,
                  tempo.ordem,
                  tempo.horaInicio,
                  tempo.horaFim,
                );
                const ocupada = isOcupada(
                  item.diaSemana.pkDiaDaSemana,
                  tempo.ordem,
                  tempo.horaInicio,
                  tempo.horaFim,
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
        );
      })}
    </div>
  );
}
