import {
  updateProgramaUCEstado,
  UpdateProgramaUCEstadoPayload,
} from "@/services/docentes/update-docente-programa-uc-status.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdateProgramaUCEstado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programaUcId,
      payload,
    }: {
      programaUcId: number;
      payload: UpdateProgramaUCEstadoPayload;
    }) => updateProgramaUCEstado({ programaUcId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programa-uc"],
      });
    },
  });
};
