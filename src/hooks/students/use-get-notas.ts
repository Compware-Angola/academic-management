import { getNotasService } from "@/services/students/notas.service";
import { useQuery } from "@tanstack/react-query";

interface UseGetNotasParams {
    codigoMatricula?: number;
    anoMin?: number;
    anoMax?: number;
}

export function useGetNotas({ codigoMatricula, anoMin, anoMax }: UseGetNotasParams) {
    return useQuery({
        queryKey: ["certificado-notas", codigoMatricula, anoMin, anoMax],
        queryFn: () => getNotasService({ codigoMatricula, anoMin, anoMax }),
        enabled: !!codigoMatricula && !!anoMin && !!anoMax,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}