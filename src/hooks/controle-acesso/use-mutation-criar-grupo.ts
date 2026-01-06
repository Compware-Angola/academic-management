import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { criarGrupoService } from "@/services/controle-acesso/criar-grupo.service";

export function useMutationCriarGrupo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarGrupoService,
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message,
      });

      // força reload da tabela
      queryClient.invalidateQueries({
        queryKey: ["grupo-acesso"],
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar grupo",
        variant: "destructive",
      });
    },
  });
}
