import { AcessoResponse, fetchAcessos, FetchAcessosParams } from "@/services/access/fetch-all-accesses.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryAcessos(params?: FetchAcessosParams) {
  return useQuery<AcessoResponse[]>({
    queryKey: ["acessos", params],
    queryFn: () => fetchAcessos(params),
    enabled: !!params, // só executa quando params existir
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
