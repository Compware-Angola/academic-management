// src/hooks/docente-substituto/use-mutation-atualizar-docente-substituto.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  atualizarDocenteSubstitutoService,
  AtualizarDocenteSubstitutoPayload,
} from "@/services/horario/atualizar-docente-substituto.service";
import { toast } from "sonner";

export const useMutationAtualizarDocenteSubstituto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AtualizarDocenteSubstitutoPayload) =>
      atualizarDocenteSubstitutoService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docente-substituto"] });
      toast.success("Substituição atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar a substituição. Tente novamente.");
    },
  });
};
