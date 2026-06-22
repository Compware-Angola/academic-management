import { useQuery } from "@tanstack/react-query";

import {
  fetchCurricularUnitFormulas,
  FetchCurricularUnitFormulasParams,
  FetchCurricularUnitFormulasResponse,
} from "@/services/post-graduation/fetch-curricular-unit-formulas.service";

export const POST_GRADUATION_CURRICULAR_UNIT_FORMULAS_QUERY_KEY =
  "post-graduation-curricular-unit-formulas";

export function useQueryCurricularUnitFormulas(
  params: FetchCurricularUnitFormulasParams,
) {
  const hasValidFilters =
    Number.isInteger(params.academicYearId) &&
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    Number.isInteger(params.courseId) &&
    params.courseId > 0 &&
    Number.isInteger(params.curricularYearId) &&
    params.curricularYearId > 0 &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchCurricularUnitFormulasResponse>({
    queryKey: [
      POST_GRADUATION_CURRICULAR_UNIT_FORMULAS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.courseId,
      params.curricularYearId,
      params.semesterId,
    ],
    queryFn: () => fetchCurricularUnitFormulas(params),
    enabled: hasValidFilters,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
