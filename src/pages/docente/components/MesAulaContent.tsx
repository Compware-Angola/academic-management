import { useMemo } from "react";
import { EventoAulaCard } from "./EventoAulaCard";

import { addDays, CalendarClassEvent, formatISODate, startOfMonth, startOfWeekMonday } from "@/util/types";

type Props = {
  dataReferencia: Date;
  eventos: CalendarClassEvent[];
  onPickDay: (isoDay: string) => void;
};

const WEEK_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function MesAulasContent({ dataReferencia, eventos, onPickDay }: Props) {
  const firstDay = startOfMonth(dataReferencia);
  const gridStart = startOfWeekMonday(firstDay);

  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarClassEvent[]>();
    for (const ev of eventos) {
      const key = ev.data_aula;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [eventos]);

  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEK_LABELS.map((label) => (
          <div key={label} className="p-3 text-center font-semibold text-sm border-r last:border-r-0">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const iso = formatISODate(day);
          const items = eventsMap.get(iso) ?? [];
          const visible = items.slice(0, 2);
          const hidden = items.length - visible.length;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onPickDay(iso)}
              className="min-h-[150px] border-r border-b p-2 text-left align-top hover:bg-muted/30 transition"
            >
              <div className="flex justify-end text-sm font-medium mb-2">
                {day.getDate()}
              </div>

              <div className="space-y-2">
                {visible.map((evento) => (
                  <EventoAulaCard key={evento.codigo} evento={evento} />
                ))}

                {hidden > 0 && (
                  <div className="text-xs text-muted-foreground font-medium">
                    +{hidden} mais
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}