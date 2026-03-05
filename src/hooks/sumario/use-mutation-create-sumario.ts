

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  createSumarioService,
  CreateSumarioPayload,
} from "@/services/sumario/create-and-update-sumario.service";

/* =========================
 * Hook - CREATE SUMÁRIO
 * ========================= */

export function useMutationCreateSumario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSumarioPayload) =>
      createSumarioService(data),

    onSuccess: () => {
    

        queryClient.invalidateQueries({ queryKey: ["sumario-agendamento-aula"] });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao criar sumário",
        description:
          error?.message ||
          "Ocorreu um problema ao tentar criar o sumário.",
        variant: "destructive",
      });
    },
  });
}