import { useQuery } from "@tanstack/react-query";

import {
  fetchOralCurricularUnits,
  FetchOralCurricularUnitsParams,
  FetchOralCurricularUnitsResponse,
} from "@/services/post-graduation/fetch-oral-curricular-units.service";

export const POST_GRADUATION_ORAL_CURRICULAR_UNITS_QUERY_KEY =
  "post-graduation-oral-curricular-units";

export function useQueryOralCurricularUnits(
  params: FetchOralCurricularUnitsParams,
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

  return useQuery<FetchOralCurricularUnitsResponse>({
    queryKey: [
      POST_GRADUATION_ORAL_CURRICULAR_UNITS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.courseId,
      params.curricularYearId,
      params.semesterId,
    ],
    queryFn: () => fetchOralCurricularUnits(params),
    enabled: hasValidFilters,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
