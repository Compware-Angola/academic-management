import {
  FetchBolsaEstudanteParams,
  FetchBolsaEstudanteResponse,
  fetchBolsaEstudanteService,
} from "@/services/financas/bolsa/fetch-bolsa-estudante.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchBolsaEstudante(
  params?: FetchBolsaEstudanteParams,
  pageUrl?: string,
) {
  console.log(params);
  return useQuery<FetchBolsaEstudanteResponse>({
    queryKey: ["bolsa-estudante", params, pageUrl],
    queryFn: () => fetchBolsaEstudanteService(params, pageUrl),
    refetchOnWindowFocus: false,
  });
}
