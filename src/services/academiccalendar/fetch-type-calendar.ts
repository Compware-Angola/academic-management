// src/services/academiccalendar/fetch-tipo-calendario.ts

import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface TipoCalendario {
  codigo: number;
  designacao: string;
}

export interface TipoCalendariosResponse {
  tipo_calendarios: TipoCalendario[];
}

/**
 * Busca todos os tipos de calendário disponíveis no sistema
 * Endpoint: GET http://34.202.163.85:8080/ords/cmpdev/uma/calendar-type/all
 */
export async function fetchTypesCalendar(): Promise<TipoCalendario[]> {
  const { data } = await axiosApexGa.get<TipoCalendariosResponse>(
    "/uma/calendar-type/all"
  );


  return data.tipo_calendarios || [];
}