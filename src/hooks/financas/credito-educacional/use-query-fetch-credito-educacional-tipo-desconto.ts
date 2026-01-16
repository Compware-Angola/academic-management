import { fetchCreditoEducacionalTipoDesconto } from "@/services/financas/credito-educacional/fetch-credito-educacional-tipo-desconto.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchCreditoEducacionalTipoDesconto() {
  return useQuery({
    queryKey: ["credito-educacional-tipo-desconto"],
    queryFn: async () => fetchCreditoEducacionalTipoDesconto(),
    staleTime: 1000 * 60 * 5,
  });
}
