import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { atualizarEstadoPauta } from "@/services/avaliacao/update-lencamento-pauta-estado";

export function useMutationAtualizarEstadoPauta() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: atualizarEstadoPauta,

    onSuccess: (data) => {
    
      queryClient.invalidateQueries({
        queryKey: ["lancamentos-pauta"],
      });

      toast({
        title: "Sucesso!",
        description: "Estado da pauta atualizado com sucesso.",
        variant: "default",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar o estado da pauta.",
        description:
          error.response?.data?.message ??
          error.message ??
          "Ocorreu um erro ao atualizar o estado da pauta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}