import {
  getCurentSemester,
  getScheduleCreationPrompt,
} from "@/services/academiccalendar/get-schedule-creation-prompt";
import { useQuery } from "@tanstack/react-query";

export function useQueryScheduleCreationPrompt(
  anoLectivo?: number,
  semestre?: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["schedule-creation-prompt", anoLectivo, semestre],
    queryFn: () => getScheduleCreationPrompt(anoLectivo, semestre),
    enabled: options?.enabled ?? (!!anoLectivo && !!semestre),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useQueryCurentSemester() {
  return useQuery({
    queryKey: ["current-semester"],
    queryFn: () => getCurentSemester(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
}
