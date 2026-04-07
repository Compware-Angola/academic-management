import { useQuery } from "@tanstack/react-query";
import { estadoMatriculaDropdown, fetchEstatisticaDeEstudantesAprovadosEReprovados, FetchEstatisticaDeEstudantesAprovadosEReprovadosParams } from "@/services/registrations/fetch-statits";

export function useEstatisticaDeEstudantesAprovadosEReprovados(
  params: FetchEstatisticaDeEstudantesAprovadosEReprovadosParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["estatistica-de-estudantes-aprovados-e-reprovados", params],
    queryFn: () =>
      fetchEstatisticaDeEstudantesAprovadosEReprovados(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    enabled: options?.enabled,
  });
}


export function useEstadoMatriculaDropdown() {
    return useQuery({
        queryKey: ["estado-matricula-dropdown"],
        queryFn: () => estadoMatriculaDropdown(),
        staleTime: 1000 * 60 * 4,
        gcTime: 1000 * 60 * 4,
    });
}