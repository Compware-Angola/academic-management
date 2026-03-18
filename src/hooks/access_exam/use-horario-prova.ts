
import { useQuery } from "@tanstack/react-query";
import {
  fetchHorarioProva,
  HorarioProvaParams,
} from "@/services/access_exam/fetch-horario-prova.service";

export function useHorarioProva(
  params: HorarioProvaParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["horario-prova", params],
    queryFn: () => fetchHorarioProva(params),
    enabled: options?.enabled ?? true,
  });
}