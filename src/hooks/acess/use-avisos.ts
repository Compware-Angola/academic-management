import { useQuery } from "@tanstack/react-query";
import { AvisosResponse, AvisosService } from "@/services/access/solicitacao/fetch-avisos.service";


export function useQueryAvisos({ page, limit, assunto}: {page: number;
  limit: number; assunto?: string})  {
  
  return useQuery<AvisosResponse>({
    queryKey: ["avisos", page, limit, assunto],
    queryFn: () => AvisosService({ page, limit, assunto }),
    
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
