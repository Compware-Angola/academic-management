import { repairScheduleService } from "@/services/horario/repairSchedule.service";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export function useRepairScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repairScheduleService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students-without-schedule"],
      });
      queryClient.invalidateQueries({ queryKey: ["registration-by-schedule"] });
      queryClient.invalidateQueries({
        queryKey: ["registration-details-by-schedule"],
      });
    },
  });
}
