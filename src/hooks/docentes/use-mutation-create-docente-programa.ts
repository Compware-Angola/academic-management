import {
  createProgramaUC,
  CreateProgramaUCPayload,
} from "@/services/docentes/post-docente-programa-uc.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationCreateProgramaUC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProgramaUCPayload) => createProgramaUC(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programa-uc"],
      });
    },
  });
};
