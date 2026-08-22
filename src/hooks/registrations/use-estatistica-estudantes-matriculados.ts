import { useQuery } from "@tanstack/react-query";
import {
  EstudantesMatriculadosStatisticsParams,
  EstudantesMatriculadosStatisticsResponse,
  fetchEstatisticaEstudantesMatriculados,
} from "@/services/registrations/fetch-estatistica-estudantes-matriculados.service";

export function useQueryEstatisticaEstudantesMatriculados(
  params: EstudantesMatriculadosStatisticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery<EstudantesMatriculadosStatisticsResponse>({
    queryKey: ["estudantes-matriculados-estatistica", params],
    queryFn: () => fetchEstatisticaEstudantesMatriculados(params),
    enabled: options?.enabled ?? true,
  });
}
