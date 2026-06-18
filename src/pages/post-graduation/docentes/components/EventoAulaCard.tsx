import { Badge } from "@/components/ui/badge";
import { CalendarClassEvent } from "@/util/types";

type Props = {
  evento: CalendarClassEvent;
};

export function EventoAulaCard({ evento }: Props) {
  return (
    <div
      className="rounded-md border p-2 text-xs space-y-1"
      style={{ backgroundColor: `${evento.cor}22`, borderColor: evento.cor }}
    >
      <div className="font-semibold leading-tight">{evento.disciplina}</div>
      <div className="text-muted-foreground">
        {evento.hora_inicio} - {evento.hora_fim}
      </div>
      <div className="text-muted-foreground">
        {evento.sala || "Sem sala"}
      </div>

      <div className="flex flex-wrap gap-1 pt-1">
        {evento.tipo_aula && (
          <Badge variant="secondary" className="text-[10px]">
            {evento.tipo_aula}
          </Badge>
        )}
        {evento.modalidade && (
          <Badge variant="outline" className="text-[10px]">
            {evento.modalidade}
          </Badge>
        )}
      </div>
    </div>
  );
}