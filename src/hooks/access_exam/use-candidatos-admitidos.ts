import { CandidatoAdmitidoParams, fetchCandidatosAdmitidos } from "@/services/access_exam/fetch-admitidos.service";
import { useQuery } from "@tanstack/react-query";

export function useCandidatosAdmitidos(filters: CandidatoAdmitidoParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["candidatos-admitidos", filters],
    queryFn: () => fetchCandidatosAdmitidos(filters),
    enabled: options?.enabled ?? true,
  });
}