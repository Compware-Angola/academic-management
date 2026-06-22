import { CalendarClassEvent } from "@/util/types";
import { EventoAulaCard } from "./EventoAulaCard";

type Props = {
  dataSelecionada: string;
  eventos: CalendarClassEvent[];
};

export function DiaAulasContent({ dataSelecionada, eventos }: Props) {
  const items = [...eventos].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{dataSelecionada}</h3>
        <p className="text-sm text-muted-foreground">
          {items.length} aula(s) agendada(s)
        </p>
      </div>

      {!items.length ? (
        <div className="text-sm text-muted-foreground py-8">Sem aulas para este dia.</div>
      ) : (
        <div className="space-y-3">
          {items.map((evento) => (
            <EventoAulaCard key={evento.codigo} evento={evento} />
          ))}
        </div>
      )}
    </div>
  );
}