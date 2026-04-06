import { admitirCandidato, AdmitirCandidatoPayload } from "@/services/access_exam/admit-candidate.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdmitirCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdmitirCandidatoPayload }) =>
      admitirCandidato(id, payload),

    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["resultado-prova"] });
      
    },

    onError: (error) => {
      console.error(error);
    },
  });
}