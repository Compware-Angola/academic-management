
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCandidato, UpdateCandidatoPayload } from "@/services/access_exam/update-candidato.service";

export function useUpdateCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCandidatoPayload }) =>
      updateCandidato(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
    },

    onError: (error) => {
      console.error(error);
    },
  });
}