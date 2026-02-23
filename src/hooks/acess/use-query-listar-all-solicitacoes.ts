import { useQuery } from "@tanstack/react-query";
import { listarAllSolicitacoesService } from "@/services/access/solicitacao/fetch-all-solicitacoes.service";


export function useQueryListarAllSolicitacoes({ page, limit}: {page: number;
  limit: number;})  {
  
  return useQuery({
    queryKey: ["all-solicitacoes", page, limit],
    queryFn: () => listarAllSolicitacoesService({ page, limit }),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
