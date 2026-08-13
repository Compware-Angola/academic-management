import { fetchVinculosGrade } from "@/services/departamento/fetch-vinculos-grade.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryVinculosGrade(params: {
    codigoGrade: number;
    anoLetivo?: number;
    codigoCurso?: number;
    enabled?: boolean;
}) {
    const { codigoGrade, anoLetivo, codigoCurso, enabled = true } = params;

    return useQuery({
        queryKey: ["vinculos-grade", codigoGrade, anoLetivo, codigoCurso],
        queryFn: () =>
            fetchVinculosGrade({
                codigoGrade,
                anoLetivo: anoLetivo as number,
                codigoCurso,
            }),
        enabled: enabled && !!codigoGrade && !!anoLetivo,
    });
}