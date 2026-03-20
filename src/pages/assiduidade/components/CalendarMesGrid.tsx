import { cn } from "@/lib/utils";
import { MesRow, StatusDoDia } from "@/util/types";
import { useMemo } from "react";

type Props = {
  dataReferencia: string; // YYYY-MM-DD
  rows: MesRow[];
  onPickDay: (isoDay: string) => void;
};

function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIso(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function statusClass(s: StatusDoDia) {
  if (s === "FALTA") return "bg-red-500/10 border-red-500/30 text-red-700";
  if (s === "PENDENTE") return "bg-amber-500/10 border-amber-500/30 text-amber-700";
  if (s === "PRESENCA") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-700";
  return "bg-muted/40 border-border text-muted-foreground";
}

export default function CalendarMesGrid({ dataReferencia, rows, onPickDay }: Props) {
  const ref = parseIso(dataReferencia);
  const year = ref.getFullYear();
  const month = ref.getMonth(); // 0-11

  const mapByDay = useMemo(() => {
    const m = new Map<string, MesRow>();
    rows.forEach((r) => m.set(r.dia, r));
    return m;
  }, [rows]);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // semana começa em segunda: (0-dom ... 6-sab) => converter
  const jsDay = firstDay.getDay();
  const mondayIndex = (jsDay + 6) % 7; // seg=0 ... dom=6
  const totalCells = mondayIndex + lastDay.getDate();
  const weeks = Math.ceil(totalCells / 7);

  const cells: Array<{ date: Date | null; iso?: string; row?: MesRow }> = [];

  // leading blanks
  for (let i = 0; i < mondayIndex; i++) cells.push({ date: null });

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const d = new Date(year, month, day);
    const iso = toIso(d);
    const row = mapByDay.get(iso);
    cells.push({ date: d, iso, row });
  }

  // trailing blanks
  while (cells.length < weeks * 7) cells.push({ date: null });

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
        {weekDays.map((w) => (
          <div key={w} className="px-2 py-1 font-medium">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((c, idx) => {
          if (!c.date) return <div key={idx} className="h-20 rounded-md border bg-muted/20" />;

          const status = c.row?.statusdodia ?? "SEM_DADOS";
          const total = c.row?.total_aulas ?? 0;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => c.iso && onPickDay(c.iso)}
              className={cn(
                "h-20 rounded-md border p-2 text-left hover:bg-muted/30 transition",
                statusClass(status)
              )}
              title={c.iso}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{c.date.getDate()}</div>
                <div className="text-[11px] opacity-80">
                  {total > 0 ? `${total} aula(s)` : ""}
                </div>
              </div>

              {c.row ? (
                <div className="mt-2 text-[11px] leading-4">
                  <div>P: {c.row.presencas}</div>
                  <div>F: {c.row.faltas}</div>
                  <div>Pe: {c.row.pendentes}</div>
                </div>
              ) : (
                <div className="mt-2 text-[11px] opacity-70"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Clique num dia para abrir o modo <span className="font-medium text-foreground">DIA</span>.
      </div>
    </div>
  );
}