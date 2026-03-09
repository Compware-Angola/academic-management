export type CalendarMode = "MES" | "SEMANA" | "DIA";

export type StatusDoDia = "FALTA" | "PENDENTE" | "PRESENCA" | "SEM_DADOS";

export type MesRow = {
  dia: string; // YYYY-MM-DD
  total_aulas: number;
  pendentes: number;
  faltas: number;
  presencas: number;
  statusdodia: StatusDoDia; // vem do backend
};

export type EventoRow = {
  codigo: number;
  dia: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fim: string; // HH:mm
  estado: number; // 1|2|3
  ordem_tempo?: number | null;
};

export type GeneralAttendanceResponse =
  | {
      modo: "MES";
      intervalo: { inicio: string; fim: string };
      data: MesRow[];
    }
  | {
      modo: "SEMANA" | "DIA";
      intervalo: { inicio: string; fim: string };
      data: EventoRow[];
    };


    // TIPOS PARA O CALENDARIO AULA DOCENTE


export function toDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toDateOnly(d);
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export type CalendarClassEvent = {
  codigo: number;
  data_aula: string;
  hora_inicio: string;
  hora_fim: string;
  estado: number;
  estado_designacao: string;
  disciplina: string;
  docente: string;
  sala: string | null;
  tipo_aula: string | null;
  modalidade: string | null;
  cor: string;
  start: string;
  end: string;
  title: string;
};