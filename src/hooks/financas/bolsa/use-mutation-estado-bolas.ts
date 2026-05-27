import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchEstadoBolsaService } from "@/services/financas/bolsa/estado-bolsa.service";
import { toast } from "sonner";

export function useMutationEstadoBolsa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) => switchEstadoBolsaService(codigo),
    onSuccess: (_, codigo) => {
      toast.success(
        `Bolsa ${codigo === 1 ? "ativada" : "desativada"} com sucesso`,
      );
      queryClient.invalidateQueries({
        queryKey: ["bolsa"],
      });
    },
  });
}
