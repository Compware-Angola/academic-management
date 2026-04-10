import { FetchEstadoMatriculaPorHorarioParams, FetchEstadoMatriculaPorHorarioResponse, fetchEstadoMatriculaPorHorarioService } from "@/services/registrations/fetch-estado-matriculados-por-horario.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryEstadoMatriculaPorHorario(
  params: FetchEstadoMatriculaPorHorarioParams
) {
  return useQuery<FetchEstadoMatriculaPorHorarioResponse>({
    queryKey: ["estado-matricula-por-horario", params],
    queryFn: () => fetchEstadoMatriculaPorHorarioService(params),
  });
}