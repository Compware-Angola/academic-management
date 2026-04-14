import { fetchInscricoesPorData, InscricoesPorDataParams } from "@/services/access_exam/fetch-estatistica-inscricoes-candidatos.service";
import { useQuery } from "@tanstack/react-query";


export function useInscricoesPorData(
    filters: InscricoesPorDataParams = {},
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ["inscricoes-por-candidatos", filters],
        queryFn: () => fetchInscricoesPorData(filters),
        enabled: options?.enabled ?? true,
    });
}