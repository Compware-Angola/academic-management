import { useQuery } from "@tanstack/react-query";
import { listarAllSolicitacoesService } from "@/services/access/solicitacao/fetch-all-solicitacoes.service";

type UseQueryListarAllSolicitacoesParams = {
  page: number;
  limit: number;
  estadoSolicitacao: string;
  tipoServicoSelecionado: number;
  userId: number;
};

export function useQueryListarAllSolicitacoes({
  page,
  limit,
  estadoSolicitacao,
  tipoServicoSelecionado,
  userId,
}: UseQueryListarAllSolicitacoesParams) {
  return useQuery({
    queryKey: [
      "all-solicitacoes",
      page,
      limit,
      estadoSolicitacao,
      tipoServicoSelecionado,
      userId,
    ],
    queryFn: () =>
      listarAllSolicitacoesService({
        page,
        limit,
        estadoSolicitacao,
        tipoServicoSelecionado,
        userId,
      }),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!estadoSolicitacao && !!userId,
  });
}