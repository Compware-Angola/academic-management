// src/hooks/docente-substituto/use-mutation-criar-docente-substituto.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  criarDocenteSubstitutoService,
  CriarDocenteSubstitutoPayload,
} from "@/services/horario/criar-docente-substituto.service";
import { toast } from "sonner";

export const useMutationCriarDocenteSubstituto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CriarDocenteSubstitutoPayload) =>
      criarDocenteSubstitutoService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docente-substituto"] });
      toast.success("Substituição criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar a substituição. Tente novamente.");
    },
  });
};