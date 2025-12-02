import {
  updateExemptDay,
  UpdateExemptDayPayload
} from "@/services/exempt-days/update-exempt-day.service";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useMutationUpdateExemptDay() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateExemptDayPayload) =>
      updateExemptDay(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["exempt-days"],
      });

      toast({
        title: "Dia isento atualizado com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar dia isento",
        description:
          error?.message ||
          "Ocorreu um erro ao atualizar o dia isento.",
        variant: "destructive",
      });
    },
  });
}
