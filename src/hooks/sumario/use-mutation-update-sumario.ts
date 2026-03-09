

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  updateSumarioService,
  UpdateSumarioPayload,
} from "@/services/sumario/create-and-update-sumario.service";

/* =========================
 * Hook - UPDATE SUMÁRIO
 * ========================= */

export function useMutationUpdateSumario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      codigo,
      payload,
    }: {
      codigo: number;
      payload: UpdateSumarioPayload;
    }) => updateSumarioService(payload, codigo),

    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["sumario-agendamento-aula"] });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar sumário",
        description:
          error?.message ||
          "Ocorreu um problema ao tentar atualizar o sumário.",
        variant: "destructive",
      });
    },
  });
}