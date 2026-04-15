import { FetchMapaAnualFinalistasParams, FetchMapaAnualFinalistasResponse, fetchMapaAnualFinalistasService } from "@/services/students/fetch-mapa-anual-finalistas.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryMapaAnualFinalistas(
  params: FetchMapaAnualFinalistasParams
) {
  return useQuery<FetchMapaAnualFinalistasResponse>({
    queryKey: [
      "mapa-anual-finalistas",
      params.page,
      params.limit,
      params.anoLectivo,
      params.grau,
      params.search,
    ],
    queryFn: () => fetchMapaAnualFinalistasService(params),
    enabled: Boolean(params.anoLectivo),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}