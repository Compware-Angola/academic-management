import { useQuery } from "@tanstack/react-query";
import { listarAllSolicitacoesService } from "@/services/access/solicitacao/fetch-all-solicitacoes.service";

type UseQueryListarAllSolicitacoesParams = {
  page: number;
  limit: number;
  estadoSolicitacao: string;
  tipoServicoSelecionado: number;
  userId: number;
  searchServico?: string;
};

export function useQueryListarAllSolicitacoes({
  page,
  limit,
  estadoSolicitacao,
  tipoServicoSelecionado,
  userId,
  searchServico,
}: UseQueryListarAllSolicitacoesParams) {
  return useQuery({
    queryKey: [
      "all-solicitacoes",
      page,
      limit,
      estadoSolicitacao,
      tipoServicoSelecionado,
      userId,
      searchServico,
    ],
    queryFn: () =>
      listarAllSolicitacoesService({
        page,
        limit,
        estadoSolicitacao,
        tipoServicoSelecionado,
        userId,
        searchServico,
      }),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!estadoSolicitacao && !!userId,
  });
}