import { fetchProvasPorCandidato, ProvaPorCandidatoParams } from "@/services/access_exam/fetch-candidate-list.service";
import { useQuery } from "@tanstack/react-query";

export function useProvasPorCandidato(
  params: ProvaPorCandidatoParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["prova-por-candidato", params],
    queryFn: () => fetchProvasPorCandidato(params),
    enabled: options?.enabled ?? true,
  });
}