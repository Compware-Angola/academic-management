
import { useQuery } from "@tanstack/react-query";
import { fetchCandidatosComProva, CandidatoComProvaParams } from "@/services/access_exam/fetch-candidatos-com-prova.service";

export function useCandidatosComProva(
  params: CandidatoComProvaParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["candidatos-com-prova", params],
    queryFn: () => fetchCandidatosComProva(params),
    enabled: options?.enabled ?? true,
  });
}