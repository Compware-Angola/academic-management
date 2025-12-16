import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface TipoCalendario {
  codigo: number;
  designacao: string;
}

export interface TipoCalendariosResponse {
  tipo_calendarios: TipoCalendario[];
}

export async function fetchTypesCalendar(): Promise<TipoCalendario[]> {
  const { data } = await axiosApexGa.get<TipoCalendariosResponse>(
    "/uma/calendar-type/all"
  );

  return data.tipo_calendarios || [];
}
