import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  UpdateScheduleParamPayload,
  updateScheduleParamService,
} from "@/services/horario/update-params-schedule.service";

export function useUpdateScheduleParam(
  id: number,
  onSuccessReset?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateScheduleParamPayload) =>
      updateScheduleParamService(id, payload),

    onSuccess: (data) => {
      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar",
          description: data.message,
        });
        return;
      }

      // 🔥 invalida a lista de parâmetros
      queryClient.invalidateQueries({
        queryKey: ["schedule-params"],
      });

      toast({
        title: "Parâmetro atualizado",
        description: data.message,
      });

      onSuccessReset?.();
    },

    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err?.message || "Erro inesperado",
      });
    },
  });
}