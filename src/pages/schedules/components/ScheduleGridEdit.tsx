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
  scheduleData: TempoDisponivelItem[];
  aulasExistentes: AulaPayload[];
  onChange: (aulas: AulaPayload[]) => void;
};

export default function ScheduleGridEdit({
  scheduleData,
  aulasExistentes,
  onChange,
}: ScheduleGridEditProps) {
  const { toast } = useToast();
  const [slotData, setSlotData] = useState<Record<SlotKey, AulaPayload>>({});

  useEffect(() => {
    const initial: Record<SlotKey, AulaPayload> = {};

    aulasExistentes.forEach((aula) => {
      const key = `${aula.diaSemana}-${aula.ordemTempo}`;
      initial[key] = aula;
    });

    setSlotData(initial);
  }, [aulasExistentes]);

  const toggleSlot = (dia: DiaSemana, tempo: Tempo) => {
    const key = `${dia.pkDiaDaSemana}-${tempo.ordem}`;
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

  /* ---------- TOGGLE TODOS DO DIA ---------- */
  const toggleAllForDay = (dia: DiaSemana, tempos: Tempo[]) => {
    const updated = { ...slotData };

    const allSelected = tempos.every((tempo) =>
      Boolean(updated[`${dia.pkDiaDaSemana}-${tempo.ordem}`]),
    );

    if (allSelected) {
      tempos.forEach((tempo) => {
        delete updated[`${dia.pkDiaDaSemana}-${tempo.ordem}`];
      });

      toast({
        title: "Tempos removidos",
        description: `Todos tempos de ${dia.designacao} removidos.`,
      });
    } else {
      tempos.forEach((tempo) => {
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
        title: "Tempos adicionados",
        description: `Todos tempos de ${dia.designacao} selecionados.`,
      });
    }

    setSlotData(updated);
    onChange(Object.values(updated));
  };

  const hasData = (diaId: number, ordem: number) =>
    Boolean(slotData[`${diaId}-${ordem}`]);

  const days = scheduleData.filter((item) => item.diaSemana);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {days.map((item) => {
        const allSelected = item.tempos.every((tempo) =>
          hasData(item.diaSemana.pkDiaDaSemana, tempo.ordem),
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
                );

                return (
                  <Button
                    key={tempo.ordem}
                    type="button"
                    onClick={() => toggleSlot(item.diaSemana, tempo)}
                    variant={filled ? "default" : "outline"}
                    className={`w-full justify-start py-3 ${
                      filled ? "bg-green-50 text-green-900" : ""
                    }`}
                  >
                    <Clock
                      size={16}
                      className={
                        filled ? "text-green-600" : "text-muted-foreground"
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
