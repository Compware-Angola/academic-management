import { useMemo } from "react";
import { EventoAulaCard } from "./EventoAulaCard";
import { addDays, CalendarClassEvent, formatISODate, startOfWeekMonday } from "@/util/types";


type Props = {
  dataReferencia: Date;
  eventos: CalendarClassEvent[];
  onPickDay: (isoDay: string) => void;
};

const WEEK_LABELS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export function SemanaAulasContent({ dataReferencia, eventos, onPickDay }: Props) {
  const start = startOfWeekMonday(dataReferencia);

  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarClassEvent[]>();
    for (const ev of eventos) {
      const key = ev.data_aula;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }

    for (const [key, value] of map.entries()) {
      value.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      map.set(key, value);
    }

    return map;
  }, [eventos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {days.map((day, idx) => {
        const iso = formatISODate(day);
        const items = grouped.get(iso) ?? [];

        return (
          <div key={iso} className="rounded-lg border bg-card p-3 space-y-3">
            <button
              type="button"
              onClick={() => onPickDay(iso)}
              className="w-full text-left"
            >
              <div className="font-semibold text-sm">{WEEK_LABELS[idx]}</div>
              <div className="text-xs text-muted-foreground">{iso}</div>
            </button>

            {!items.length ? (
              <div className="text-xs text-muted-foreground py-4">Sem aulas</div>
            ) : (
              <div className="space-y-2">
                {items.map((evento) => (
                  <EventoAulaCard key={evento.codigo} evento={evento} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}