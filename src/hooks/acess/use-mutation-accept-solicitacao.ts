import { aprovarSolicitacao, AprovarSolicitacaoPayload } from "@/services/access/solicitacao/accept-solicitacao.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAprovarSolicitacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AprovarSolicitacaoPayload) =>
      aprovarSolicitacao(payload),

    onSuccess: () => {
      // 🔄 Atualiza listas dependentes
      queryClient.invalidateQueries({
        queryKey: ["solicitacoes"],
      });
    },

    onError: (error: any) => {
      console.error(
        error?.response?.data?.message ||
          "Erro ao aprovar solicitação"
      );
    },
  });
}
