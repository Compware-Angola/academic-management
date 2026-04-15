import { FetchEstudantesPorEstadoMatriculaParams, FetchEstudantesPorEstadoMatriculaResponse, fetchEstudantesPorEstadoMatriculaService } from "@/services/registrations/fetch-estudantes-matriculados-por-estado.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryEstudantesPorEstadoMatricula(
  params: FetchEstudantesPorEstadoMatriculaParams
) {
  return useQuery<FetchEstudantesPorEstadoMatriculaResponse>({
    queryKey: ["estudantes-por-estado-matricula", params],
    queryFn: () => fetchEstudantesPorEstadoMatriculaService(params),
  });
}