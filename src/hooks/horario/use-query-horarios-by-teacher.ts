import { ListSchedulesPayload, ListSchedulesResponse, listSchedulesService } from "@/services/horario/feat.get-horario-by-teacher.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryListSchedules = (filters: ListSchedulesPayload) => {
const enabled = !!filters.teacherId && !!filters.anoLectivo;
  return useQuery<ListSchedulesResponse>({
    queryKey: ["list-schedules-teacher", filters],
    queryFn: () => listSchedulesService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};