import { fetchCreditoEducacionalEstudante } from "@/services/financas/credito-educacional/fetch-credito-educacional-estudante.service";
import {
  fetchCreditoEducacional,
  FetchCreditoEducacionalParams,
} from "@/services/financas/credito-educacional/fetch-credito-educacional.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchCreditoEducacionalEstudante(
  params?: FetchCreditoEducacionalParams,
) {
  return useQuery({
    queryKey: ["credito-educacional-estudante"],
    queryFn: async () => fetchCreditoEducacionalEstudante(),
    staleTime: 1000 * 60 * 5,
  });
}
