import { useQuery } from "@tanstack/react-query";
import {
  fetchDescontos,
  FetchDescontoParams,
  Desconto,
  PaginationResponse,
} from "@/services/financas/descontos/descontos.service.ts";

export function useQueryFetchDescontos(params: FetchDescontoParams) {
  return useQuery<PaginationResponse<Desconto>>({
    queryKey: ["descontos", params],
    queryFn: () => fetchDescontos(params),
    refetchOnWindowFocus: false,
  });
}
