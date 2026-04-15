import { FetchRegistoPrimarioMatriculadosParams, FetchRegistoPrimarioMatriculadosResponse, fetchRegistoPrimarioMatriculadosService } from "@/services/students/fetch-registo-primario-matriculados.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryRegistoPrimarioMatriculados(
  params: FetchRegistoPrimarioMatriculadosParams
) {
  return useQuery<FetchRegistoPrimarioMatriculadosResponse>({
    queryKey: [
      "registo-primario-matriculados",
      params.page,
      params.limit,
      params.anoLectivo,
      params.grau,
      params.anoCurricular,
      params.estado,
      params.search,
    ],
    queryFn: () => fetchRegistoPrimarioMatriculadosService(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}