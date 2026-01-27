import {
  fetchBolsaService,
  FetchBolsaParams,
  FetchBolsaResponse,
} from "@/services/financas/bolsa/fetch-bolsa.service";

import { useQuery } from "@tanstack/react-query";

export function useQueryFetchBolsa(
  params?: FetchBolsaParams,
  pageUrl?: string,
) {
  return useQuery<FetchBolsaResponse>({
    queryKey: ["bolsa", params, pageUrl],
    queryFn: () => fetchBolsaService(params, pageUrl),

    refetchOnWindowFocus: false,
  });
}
