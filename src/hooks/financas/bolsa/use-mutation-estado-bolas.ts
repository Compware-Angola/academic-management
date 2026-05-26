import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchEstadoBolsaService } from "@/services/financas/bolsa/estado-bolsa.service";
import { useToast } from "@/hooks/use-toast";

export function useMutationEstadoBolsa() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) => switchEstadoBolsaService(codigo),

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
