import { getScheduleCreationPrompt } from "@/services/academiccalendar/get-schedule-creation-prompt";
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
