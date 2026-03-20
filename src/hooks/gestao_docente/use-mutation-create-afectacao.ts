import {
  createDocenteAfectacao,
  CreateDocenteAfectacaoPayload,
} from "@/services/gestao_docente/create-afectacao.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationCreateDocenteAfectacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocenteAfectacaoPayload) =>
      createDocenteAfectacao(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gestao-docentes-afectacao"],
      });
    },
  });
};
