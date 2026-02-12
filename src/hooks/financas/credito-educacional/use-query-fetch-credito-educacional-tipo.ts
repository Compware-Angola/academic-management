import { fetchCreditoEducacionalTipo, TipoCreditoFilters } from "@/services/financas/credito-educacional/fetch-credito-educacional-tipo.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchCreditoEducacionalTipo(filters?: TipoCreditoFilters) {
  return useQuery({
    queryKey: ["credito-educacional-tipo", filters],
    queryFn: async () => fetchCreditoEducacionalTipo(filters),
    staleTime: 1000 * 60 * 5,
  });
}
