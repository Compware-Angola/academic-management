// src/hooks/docente-substituto/use-mutation-deletar-docente-substituto.ts

import { deletarDocenteSubstitutoService } from "@/services/horario/deletar-docente-substituto.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export const useMutationDeletarDocenteSubstituto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      deletarDocenteSubstitutoService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docente-substituto"] });
      toast.success("Substituição eliminada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao eliminar a substituição. Tente novamente.");
    },
  });
};