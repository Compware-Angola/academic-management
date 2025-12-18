import {
  fetchScheduleWithSchedule,
  ScheduleWIthPermissionParams,
} from "@/services/horario/fetch-schedule-with-permission.service";
import { useQuery } from "@tanstack/react-query";

export const useScheduleWithPermissionQuery = (
  params: ScheduleWIthPermissionParams
) => {
  // Remove params undefined / null / falsy
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return useQuery({
    // QueryKey específica para evitar conflito com o hook antigo
    queryKey: ["schedule-with-permission", cleanParams],
    queryFn: () => fetchScheduleWithSchedule(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: Boolean(params.anoLectivo),
  });
};
