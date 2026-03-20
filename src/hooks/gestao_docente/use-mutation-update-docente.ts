import {
  updateDocente,
  UpdateDocentePayload,
} from "@/services/gestao-docente/update-docente.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdateDocente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      codigo,
      payload,
    }: {
      codigo: number;
      payload: UpdateDocentePayload;
    }) => updateDocente({ codigo, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["docentes-list"],
      });
    },
  });
};
