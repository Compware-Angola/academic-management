import {
  FetchInstituicaoParams,
  FetchInstituicaoResponse,
  fetchInstituicaoService,
} from "@/services/financas/instituicao/fetch-instituicao.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchInstituicao(
  params?: FetchInstituicaoParams,
  pageUrl?: string,
) {
  return useQuery<FetchInstituicaoResponse>({
    queryKey: ["instituicao", params, pageUrl],
    queryFn: () => fetchInstituicaoService(params, pageUrl),

    refetchOnWindowFocus: false,
  });
}
