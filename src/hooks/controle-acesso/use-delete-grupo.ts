import { deleteGrupoService } from "@/services/controle-acesso/delete-grupo.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grupoId: number | string) => deleteGrupoService(grupoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupo-acesso"] });
    },
  });
}
