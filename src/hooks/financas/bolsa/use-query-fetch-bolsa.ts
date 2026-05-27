import {
  fetchBolsaService,
  FetchBolsaParams,
  FetchBolsaResponse,
} from "@/services/financas/bolsa/fetch-bolsa.service";

import { useQuery } from "@tanstack/react-query";

export function useQueryFetchBolsa(params?: FetchBolsaParams) {
  return useQuery<FetchBolsaResponse>({
    queryKey: ["bolsa", params],
    queryFn: () => fetchBolsaService(params),

    refetchOnWindowFocus: false,
  });
}
