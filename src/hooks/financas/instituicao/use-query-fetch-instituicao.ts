import {
  FetchInstituicaoParams,
  fetchInstituicoes,
} from "@/services/financas/instituicao/fetch-instituicao.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchInstituicao(params?: FetchInstituicaoParams) {
  return useQuery({
    queryKey: ["instituicoes", params],
    queryFn: () => fetchInstituicoes(params),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
