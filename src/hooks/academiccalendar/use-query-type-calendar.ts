// src/hooks/queries/use-query-tipo-calendario.ts

import { fetchTypesCalendar, TipoCalendario } from "@/services/academiccalendar/fetch-type-calendar";
import { useQuery } from "@tanstack/react-query";

export function useQueryTypeCalendar() {
  return useQuery<TipoCalendario[], Error>({
    queryKey: ["tipos-calendario"],
    queryFn: fetchTypesCalendar,
    staleTime: 1000 * 60 * 60, // 1 hora (esses dados quase nunca mudam)
   
    retry: 2,
  });
}