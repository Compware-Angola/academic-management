import { UpdateProgramaUCEstadoPayload } from "@/services/docentes/update-docente-programa-uc-status.service";
import { updateProgramaUCVisibilidade } from "@/services/docentes/update-docente-programa-uc-visibilidade.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdateProgramaUCVisibilidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programaUcId,
      payload,
    }: {
      programaUcId: number;
      payload: UpdateProgramaUCEstadoPayload;
    }) => updateProgramaUCVisibilidade({ programaUcId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programa-uc"],
      });
    },
  });
};
