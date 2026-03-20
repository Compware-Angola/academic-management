import { Button } from "@/components/ui/button";

type ViewMode = "MES" | "SEMANA" | "DIA";

type Props = {
  modo: ViewMode;
  titulo: string;
  onChangeModo: (modo: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function AttendanceCalendarToolbar({
  modo,
  titulo,
  onChangeModo,
  onPrev,
  onNext,
  onToday,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onPrev}>Anterior</Button>
        <Button variant="outline" onClick={onNext}>Próximo</Button>
        <Button onClick={onToday}>Hoje</Button>
      </div>

      <div className="text-2xl font-bold text-center">{titulo}</div>

      <div className="flex items-center gap-2">
        <Button variant={modo === "MES" ? "default" : "outline"} onClick={() => onChangeModo("MES")}>
          Mês
        </Button>
        <Button variant={modo === "SEMANA" ? "default" : "outline"} onClick={() => onChangeModo("SEMANA")}>
          Semana
        </Button>
        <Button variant={modo === "DIA" ? "default" : "outline"} onClick={() => onChangeModo("DIA")}>
          Dia
        </Button>
      </div>
    </div>
  );
}