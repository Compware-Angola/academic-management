import { createOrientadorService } from "@/services/defesa-tfc/criar-orientador-tff.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationCreateOrientadorTfc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrientadorService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orientadores-tfc"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}