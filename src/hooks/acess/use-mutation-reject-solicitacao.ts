import { rejectSolicitacao, RejectSolicitacaoPayload } from "@/services/access/solicitacao/reject-solicitacao.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useRejectSolicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectSolicitacaoPayload) =>
      rejectSolicitacao(payload),

    onSuccess: () => {
      // 🔄 refetch automático das listas afetadas
      queryClient.invalidateQueries({
        queryKey: ["solicitacoes"],
      });
    },

    onError: (error: any) => {
      console.error(
        error?.response?.data?.message ||
          "Erro ao rejeitar solicitação"
      );
    },
  });
}
