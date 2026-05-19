import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createVaga,
  type CreateVagaPayload,
} from "@/services/access_exam/create-vaga.service";

export function useCreateVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVagaPayload) => createVaga(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
