// src/hooks/assessment/useQueryAssessmentStats.ts
import {
  GetAssessmentStatsPayload,
  GetAssessmentStatsResponse,
  getAssessmentStatsService,
} from "@/services/avaliacao/fetch-statistic-assessment.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryAssessmentStats = (
  filters: GetAssessmentStatsPayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  }
) => {
  const { anoLectivo, tipoProva, tipoAvaliacao, horarioId, gradeId } = filters;

  // Só faz a chamada se todos os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo &&
        !!tipoProva &&
        !!tipoAvaliacao &&
        !!horarioId &&
        !!gradeId;

  return useQuery<GetAssessmentStatsResponse>({
    queryKey: [
      "assessment-stats",
      { anoLectivo, tipoProva, tipoAvaliacao, horarioId, gradeId },
    ],
    queryFn: () => getAssessmentStatsService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos (antigo cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
