import { findPlanoCurricularGrade } from "@/services/departamento/fetch-plano-curricular-grade.service";
import { useQuery } from "@tanstack/react-query";

interface UseQueryPlanoCurricularGradeParams {
  codigoGrade: number;
  anoLetivo?: number;
  enabled?: boolean;
}

export function useQueryPlanoCurricularGrade({
  codigoGrade,
  anoLetivo,
  enabled = true,
}: UseQueryPlanoCurricularGradeParams) {
  return useQuery({
    queryKey: ["plano-curricular-grade", codigoGrade, anoLetivo],
    queryFn: () =>
      findPlanoCurricularGrade({
        codigoGrade,
        anoLetivo: anoLetivo as number,
      }),
    enabled: enabled && !!codigoGrade && !!anoLetivo,
  });
}
