import { fetchCreditoEducacionalTipo } from "@/services/financas/credito-educacional/fetch-credito-educacional-tipo.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchCreditoEducacionalTipo() {
  return useQuery({
    queryKey: ["credito-educacional-tipo"],
    queryFn: async () => fetchCreditoEducacionalTipo(),
    staleTime: 1000 * 60 * 5,
  });
}
