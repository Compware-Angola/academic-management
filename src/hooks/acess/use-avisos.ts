import { useQuery } from "@tanstack/react-query";
import { AvisosResponse, AvisosService } from "@/services/access/solicitacao/fetch-avisos.service";


export function useQueryAvisos({ page, limit}: {page: number;
  limit: number;})  {
  
  return useQuery<AvisosResponse>({
    queryKey: ["all-solicitacoes", page, limit],
    queryFn: () => AvisosService({ page, limit }),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
