import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { editarGrupoService } from "@/services/controle-acesso/editar-grupo.service";

export function useMutationEditarGrupo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editarGrupoService,
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: ["grupo-acesso"],
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao editar grupo",
        variant: "destructive",
      });
    },
  });
}
