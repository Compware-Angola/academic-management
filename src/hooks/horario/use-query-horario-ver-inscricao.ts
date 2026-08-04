// src/hooks/horario/use-query-horario-ver-inscricao.ts
import {
  fetchHorarioVerInscricao,
  FindHorarioVerInscricaoParams,
  HorarioVerInscricao,
} from "@/services/horario/fetch-horario-ver-inscricao";
import { useQuery } from "@tanstack/react-query";


export function useQueryHorarioVerInscricao(
  params: FindHorarioVerInscricaoParams ,
) {
  const { curso, gradeCurricular, anoLectivo, periodo } = params;

  return useQuery<HorarioVerInscricao[], Error>({
    queryKey: ["horario-ver-inscricao", curso, gradeCurricular, anoLectivo, periodo],
    queryFn: async () => {
      if (!curso || !gradeCurricular || !anoLectivo) {
        return [];
      }

      return fetchHorarioVerInscricao({ curso, gradeCurricular, anoLectivo, periodo });
    },
    enabled: !!curso && !!gradeCurricular && !!anoLectivo ,
    staleTime: 5 * 60 * 1000,
  });
}