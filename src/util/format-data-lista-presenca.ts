// utils/formatProvaDates.ts

const TIMEZONE = "Africa/Luanda"; // UTC+1, sem horário de verão

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

/** Formata a data da prova (ex: "22 de julho de 2026") */
export function formatDataProva(isoDate?: string | null): string {
  const date = parseDate(isoDate);
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-AO", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Formata hora (ex: "08:00") a partir de um ISO onde só a hora importa */
export function formatHoraProva(isoDate?: string | null): string {
  const date = parseDate(isoDate);
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-AO", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

/** Monta o intervalo "08:00 - 10:00" */
export function formatIntervaloProva(
  horaInicio?: string | null,
  horaTermino?: string | null,
): string {
  const inicio = formatHoraProva(horaInicio);
  const termino = formatHoraProva(horaTermino);
  if (inicio === "—" && termino === "—") return "—";
  return `${inicio} - ${termino}`;
}

/** Formata a duração (ex: "01h46") a partir de "1900-01-01T01:46:25.000Z" */
export function formatDuracaoProva(isoDuration?: string | null): string {
  if (!isoDuration) return "—";
  const match = isoDuration.match(/T(\d{2}):(\d{2}):(\d{2})/);
  if (!match) return "—";
  const [, hh, mm] = match;
  return `${hh}h${mm}`;
}
