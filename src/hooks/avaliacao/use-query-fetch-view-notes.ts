// src/hooks/assessment/useQueryAssessmentNotas.ts

import {
  GetAssessmentNotasPayload,
  GetAssessmentNotasResponse,
  getAssessmentNotasService,
} from "@/services/avaliacao/fetch-view-notes.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryViewNotas = (
  filters: GetAssessmentNotasPayload,
  options?: {
    enabled?: boolean;
  }
) => {
  const {
    anoLectivo,
    tipoProva,
    tipoAvaliacao,
    horarioOrTurmaId,
    tipoConsulta,
    page = 1,
    limit = 25,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo &&
        !!tipoProva &&
        !!horarioOrTurmaId &&
        !!page &&
        !!limit &&
        !!tipoAvaliacao;

  return useQuery<GetAssessmentNotasResponse>({
    queryKey: [
      "assessment-notas",
      {
        anoLectivo,
        tipoProva,
        tipoAvaliacao,
        horarioOrTurmaId,
        tipoConsulta,
        page,
        limit,
      },
    ],
    queryFn: () => getAssessmentNotasService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
