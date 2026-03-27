import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apagarOrientadorService } from "@/services/defesa-tfc/apagar-orientador-tffc.service";
import { toast } from "sonner";

export function useMutationApagarOrientador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orientadorId,
      anoLectivoId,
    }: {
      orientadorId: number;
      anoLectivoId: number;
    }) => apagarOrientadorService(orientadorId, anoLectivoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orientadores-tfc"] });
      queryClient.invalidateQueries({ queryKey: ["vinculos"] });
      toast.success("Orientador apagado com sucesso!");
    },
  });
}