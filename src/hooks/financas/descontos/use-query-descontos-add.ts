import { useQuery } from "@tanstack/react-query";
import {
  fetchDescontosAdd,
  FetchDescontosAddParams,
  AtribuirItem,
  PaginationResponse,
} from "@/services/financas/descontos/descontos.service.ts";

export function useQueryFetchDescontosAdd(params: FetchDescontosAddParams) {
  return useQuery<PaginationResponse<AtribuirItem>>({
    queryKey: ["descontosAdd", params],
    queryFn: () => fetchDescontosAdd(params),
    refetchOnWindowFocus: false,
  });
}
