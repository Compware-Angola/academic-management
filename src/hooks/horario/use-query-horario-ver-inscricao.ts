// src/hooks/horario/use-query-horario-ver-inscricao.ts
import {
  fetchHorarioVerInscricao,
  HorarioVerInscricao,
} from "@/services/horario/fetch-horario-ver-inscricao";
import { useQuery } from "@tanstack/react-query";

type UseQueryHorarioVerInscricaoParams = {
  curso?: string;
  gradeCurricular?: string;
  anoLectivo?: string;
};

export function useQueryHorarioVerInscricao(
  params: UseQueryHorarioVerInscricaoParams = {},
) {
  const { curso, gradeCurricular, anoLectivo } = params;

  return useQuery<HorarioVerInscricao[], Error>({
    queryKey: ["horario-ver-inscricao", curso, gradeCurricular, anoLectivo],
    queryFn: async () => {
      if (!curso || !gradeCurricular || !anoLectivo) {
        return [];
      }

      return fetchHorarioVerInscricao({ curso, gradeCurricular, anoLectivo });
    },
    enabled: !!curso && !!gradeCurricular && !!anoLectivo,
    staleTime: 5 * 60 * 1000,
  });
}