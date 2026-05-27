import {
  atribuirBolsa,
  updateBolsaEstudanteService,
} from "@/services/financas/bolsa/atribuir-bolsa.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationAtribuirBolsa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: atribuirBolsa,
    onSuccess: () => {
      toast.success("Bolsa atribuída com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["credito-educacional-estudante"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsa-estudante"],
      });
    },
  });
}

export function useMutationUpdateBolsaEstudante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBolsaEstudanteService,
    onSuccess: () => {
      toast.success("Bolsa atualizada com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["credito-educacional-estudante"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsa-estudante"],
      });
    },
  });
}
