import { fetchInscricoesPorDia, InscricoesPorDiaParams } from "@/services/access_exam/fecth-inscricoes-por-dia.service";
import { useQuery } from "@tanstack/react-query";

export function useInscricoesPorDia(
  filters: InscricoesPorDiaParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["inscricoes-por-dia", filters],
    queryFn: () => fetchInscricoesPorDia(filters),
    enabled: options?.enabled ?? true,
  });
}