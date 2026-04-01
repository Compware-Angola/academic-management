import { useQuery } from "@tanstack/react-query";
import { fetchListProvaPorCandidato, FilterCandidatoProvaParams } from "@/services/access_exam/fetch-prova-candidatos.service";

export function useListProvaPorCandidato(filters: FilterCandidatoProvaParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["list-prova-por-candidato", filters],
    queryFn: () => fetchListProvaPorCandidato(filters),
    enabled: options?.enabled ?? true,
  });
}