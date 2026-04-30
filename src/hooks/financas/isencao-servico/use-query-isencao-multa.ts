import { useQuery } from "@tanstack/react-query";

import {
  PaginationResponse,
  FetchIsencaoMultaPayloadPaginated,
  IsencaoMulta,
  fetchIsencaoMultaAll,
} from "@/services/financas/isencao-servicos/isencao-multa.service";

export function useQueryFetchIsencaoMulta(
  params?: FetchIsencaoMultaPayloadPaginated,
) {
  return useQuery<PaginationResponse<IsencaoMulta>>({
    queryKey: ["isencao-multa", params],
    queryFn: () => fetchIsencaoMultaAll(params ?? {}),
    refetchOnWindowFocus: false,
  });
}
