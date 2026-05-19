import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVaga } from "@/services/access_exam/delete-vaga.service";

export function useDeleteVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
