import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  UpdateAvisoRequest,
  updateAvisoService,
} from "@/services/access/solicitacao/update-aviso.service";

/**
 * Hook React-Query responsável por atualizar avisos.
 *
 * Este hook encapsula a chamada à API de atualização e trata efeitos colaterais,
 * como invalidar a cache da lista de avisos e exibir notificações de sucesso
 * ou erro. Para utilizá-lo, chame `useMutationUpdateAviso()` e invoque
 * `mutate()` passando um objeto `UpdateAvisoRequest`.
 */
export const useMutationUpdateAviso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    // Recebe um payload com id e demais campos a serem atualizados
    mutationFn: (payload: UpdateAvisoRequest) => updateAvisoService(payload),

    onSuccess: () => {
      // Invalida a lista de avisos para recarregar os dados atualizados
      queryClient.invalidateQueries({
        queryKey: ["avisos"],
      });
      toast({
        title: "Atualizado com sucesso!",
        description: "O aviso foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar aviso",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar atualizar o aviso.",
        variant: "destructive",
      });
    },
  });
};