// src/hooks/horario/useQueryScheduleDetails.ts
import { getScheduleDetailsService, ScheduleDetailsResponse } from "@/services/horario/get-schedule-by-id.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryScheduleDetails = (
  turmaId: number | null,
  options?: { enabled?: boolean }
) => {
  return useQuery<ScheduleDetailsResponse>({
    queryKey: ["schedule-details", turmaId],
    queryFn: () => getScheduleDetailsService(turmaId!),
    enabled: !!turmaId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};