import {
  FetchRegistoPrimarioMatriculadosParams,
  FetchRegistoPrimarioMatriculadosResponse,
  fetchRegistoPrimarioMatriculadosService,
} from "@/services/students/fetch-registo-primario-matriculados.service";
import { useQuery } from "@tanstack/react-query";

type UseQueryRegistoPrimarioMatriculadosOptions = {
  enabled?: boolean;
};

export function useQueryRegistoPrimarioMatriculados(
  params: FetchRegistoPrimarioMatriculadosParams,
  options?: UseQueryRegistoPrimarioMatriculadosOptions
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
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}