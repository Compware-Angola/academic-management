import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  estadoBolsaActiveService,
  estadoBolsaInactiveService,
} from "@/services/financas/bolsa/estado-bolsa.service";
import { useToast } from "@/hooks/use-toast";

export function useMutationActiveBolsa() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) => estadoBolsaActiveService(codigo),

    onSuccess: () => {
      toast({
        title: "Bolsa ativada com sucesso",
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsa"],
      });
    },
  });
}

export function useMutationInactiveBolsa() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) => estadoBolsaInactiveService(codigo),

    onSuccess: () => {
      toast({
        title: "Bolsa inativada com sucesso",
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsa"],
      });
    },
  });
}
