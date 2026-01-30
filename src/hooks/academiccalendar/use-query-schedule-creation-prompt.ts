import { getScheduleCreationPrompt } from "@/services/academiccalendar/get-schedule-creation-prompt";
import { useQuery } from "@tanstack/react-query";

export function useQueryScheduleCreationPrompt(anoLectivo: number) {
  return useQuery({
    queryKey: ["schedule-creation-prompt", anoLectivo],
    queryFn: () => getScheduleCreationPrompt(anoLectivo),
    enabled: !!anoLectivo,
    staleTime: 1000 * 60 * 5,
  });
}
