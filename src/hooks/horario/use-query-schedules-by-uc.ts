// src/hooks/schedule/useQuerySchedulesByUc.ts
import { GetSchedulesByUcPayload, GetSchedulesByUcResponse, getSchedulesByUcService } from "@/services/horario/fetch-schedule-by-uc.service";
import { useQuery } from "@tanstack/react-query";

export const useQuerySchedulesByUc = (
  filters: GetSchedulesByUcPayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  }
) => {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    unidadeCurricular,
    docente,
    page = 1,
    limit = 25,
  } = filters;

  // Só faz a chamada se todos os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo &&
      !!semestre &&
      !!periodo &&
      !!curso &&
      !!unidadeCurricular;

  return useQuery<GetSchedulesByUcResponse>({
    queryKey: [
      "schedules-by-uc",
      { anoLectivo, semestre, periodo, curso, unidadeCurricular, docente, page, limit },
    ],
    queryFn: () => getSchedulesByUcService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30,    // 30 minutos (antigo cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};