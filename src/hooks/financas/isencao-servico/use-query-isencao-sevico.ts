import { useQuery } from "@tanstack/react-query";
import {
    fetchIsencaoServicoAll,
    FetchIsencaoServicoPayloadPaginated, IsencaoServico, PaginationResponse
} from "@/services/financas/isencao-servicos/isencao-servico.service.ts";

export function useQueryFetchIsencaoServico(params?: FetchIsencaoServicoPayloadPaginated) {
  return useQuery<PaginationResponse<IsencaoServico>>({
    queryKey: ["isencao-servico", params],
    queryFn: () => fetchIsencaoServicoAll(params),
      refetchOnWindowFocus: false,
  });
}
