import {
  updateAfectacaoStatus,
  UpdateAfectacaoStatusPayload,
} from "@/services/gestao-docente/update-afectacao-status.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdateAfectacaoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      codigo,
      payload,
    }: {
      codigo: number;
      payload: UpdateAfectacaoStatusPayload;
    }) => updateAfectacaoStatus({ codigo, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["docentes-afectacao"],
      });
    },
  });
};
