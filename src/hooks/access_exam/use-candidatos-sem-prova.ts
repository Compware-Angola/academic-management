
import { useQuery } from "@tanstack/react-query";
import { fetchCandidatosSemProva, CandidatoSemProvaParams } from "@/services/access_exam/fetch-candidatos-sem-prova.service";

export function useCandidatosSemProva(
  params: CandidatoSemProvaParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["candidatos-sem-prova", params],
    queryFn: () => fetchCandidatosSemProva(params),
    enabled: options?.enabled ?? true,
  });
}