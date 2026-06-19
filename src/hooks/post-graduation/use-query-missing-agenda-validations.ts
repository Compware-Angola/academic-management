import { useQuery } from "@tanstack/react-query";

import {
  fetchMissingAgendaValidations,
  FetchMissingAgendaValidationsParams,
  FetchMissingAgendaValidationsResponse,
} from "@/services/post-graduation/fetch-missing-agenda-validations.service";

export const POST_GRADUATION_MISSING_AGENDA_VALIDATIONS_QUERY_KEY =
  "post-graduation-missing-agenda-validations";

export function useQueryMissingAgendaValidations(
  params: FetchMissingAgendaValidationsParams,
  enabled = true,
) {
  const hasContext =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchMissingAgendaValidationsResponse>({
    queryKey: [
      POST_GRADUATION_MISSING_AGENDA_VALIDATIONS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
      params.curricularYearId ?? null,
      params.curricularGradeId ?? null,
      params.page,
      params.limit,
    ],
    queryFn: () => fetchMissingAgendaValidations(params),
    enabled: enabled && hasContext,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}
