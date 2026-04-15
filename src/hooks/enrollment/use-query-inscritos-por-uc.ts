import { FetchInscritosPorUcParams, FetchInscritosPorUcResponse, fetchInscritosPorUcService } from "@/services/enrollment/fetch-inscritos-por-uc-service";
import { useQuery } from "@tanstack/react-query";


export function useQueryInscritosPorUc(
  params: FetchInscritosPorUcParams
) {
  return useQuery<FetchInscritosPorUcResponse>({
    queryKey: [
      "inscritos-por-uc",
      params.page,
      params.limit,
      params.anoLectivo,
      params.curso,
      params.anoCurricular,
      params.semestre,
      params.periodo,
      params.cadeira,
      params.horario,
      params.estado,
      params.search,
    ],
    queryFn: () => fetchInscritosPorUcService(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}