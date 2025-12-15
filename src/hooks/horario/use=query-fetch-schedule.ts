import {
  fetchSchedule,
  ScheduleParams,
} from "@/services/horario/fetch-schedule.service";
import { useQuery } from "@tanstack/react-query";

export const useScheduleQuery = (params: ScheduleParams) => {
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return useQuery({
    // QueryKey com apenas valores definidos
    queryKey: ["schedule", cleanParams],
    queryFn: () => fetchSchedule(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: Boolean(params.anoLectivo) && Boolean(params.semestre),
  });
};
