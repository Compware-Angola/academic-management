
import { useQuery } from "@tanstack/react-query";
import { fetchCandidatos, FilterCandidatoParams } from "@/services/access_exam/fetch-candidatos.service";

export function useCandidatos(filters: FilterCandidatoParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["candidatos", filters],
    queryFn: () => fetchCandidatos(filters),
    enabled: options?.enabled ?? true,
  });
}