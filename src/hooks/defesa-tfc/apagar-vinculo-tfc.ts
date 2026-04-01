import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apagarVinculoService } from "@/services/defesa-tfc/apagar-vinculo.service";
import { toast } from "sonner";

export function useMutationApagarVinculo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vinculoId: number) => apagarVinculoService(vinculoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orientadores-tfc"] });
      queryClient.invalidateQueries({ queryKey: ["vinculos"] });
      queryClient.invalidateQueries({ queryKey: ["docente-alunos"] });
      toast.success("Vinculo apagado com sucesso!");
    },
  });
}