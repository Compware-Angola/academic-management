import { GetScheduleParamsPayload, getScheduleParamsService } from "@/services/horario/schedule-params.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryScheduleParams = (filters: GetScheduleParamsPayload) => {
  const enabled = !!filters.page;

  return useQuery({
    queryKey: ["schedule-params", filters],
    queryFn: () => getScheduleParamsService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};