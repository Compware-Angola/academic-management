import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateVaga,
  type UpdateVagaPayload,
} from "@/services/access_exam/update-vaga.service";

export function useUpdateVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateVagaPayload }) =>
      updateVaga(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
