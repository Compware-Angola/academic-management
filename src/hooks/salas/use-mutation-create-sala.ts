import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

import {
  CreateSalaPayload,
  createSala,
} from "@/services/salas/create-sala";

export function useMutationCreateSala() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSalaPayload) => createSala(data),

    onSuccess: () => {
      toast({
        title: "Sala cadastrada com sucesso",
      });

      // Atualiza lista
      queryClient.invalidateQueries({
        queryKey: ["salas-new"],
      });
    },

    onError: () => {
      toast({
        title: "Erro ao cadastrar sala",
        variant: "destructive",
      });
    },
  });
}
