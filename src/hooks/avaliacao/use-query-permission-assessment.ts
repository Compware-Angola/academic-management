// src/hooks/assessment/useQueryAssessmentPermissions.ts
import {
  GetAssessmentPermissionsPayload,
  GetAssessmentPermissionsResponse,
  getAssessmentPermissionsService,
} from "@/services/avaliacao/fetch-permission-assessment";
import { useQuery } from "@tanstack/react-query";

export const useQueryAssessmentPermissions = (
  filters: GetAssessmentPermissionsPayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  }
) => {
  const { anoLectivo, page = 1, limit = 25 } = filters;

  // Só faz a chamada se todos os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!anoLectivo;

  return useQuery<GetAssessmentPermissionsResponse>({
    queryKey: ["assessment-permissions", { anoLectivo, page, limit }],
    queryFn: () => getAssessmentPermissionsService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos (antigo cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
