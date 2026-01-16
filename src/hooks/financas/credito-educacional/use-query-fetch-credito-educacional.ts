import {
  fetchCreditoEducacional,
  FetchCreditoEducacionalParams,
} from "@/services/financas/credito-educacional/fetch-credito-educacional.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchCreditoEducacional(
  params?: FetchCreditoEducacionalParams
) {
  return useQuery({
    queryKey: ["credito-educacional", params],
    queryFn: async () => fetchCreditoEducacional(params),
    staleTime: 1000 * 60 * 5,
  });
}
