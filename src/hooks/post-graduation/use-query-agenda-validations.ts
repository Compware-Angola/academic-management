import { useQuery } from "@tanstack/react-query";

import {
  fetchAgendaValidations,
  FetchAgendaValidationsParams,
  FetchAgendaValidationsResponse,
} from "@/services/post-graduation/fetch-agenda-validations.service";

export const POST_GRADUATION_AGENDA_VALIDATIONS_QUERY_KEY =
  "post-graduation-agenda-validations";

export function useQueryAgendaValidations(
  params: FetchAgendaValidationsParams,
  enabled = true,
) {
  const hasContext =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchAgendaValidationsResponse>({
    queryKey: [
      POST_GRADUATION_AGENDA_VALIDATIONS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
      params.curricularYearId ?? null,
      params.curricularGradeId ?? null,
      params.assessmentTypeId ?? null,
      params.statusId ?? null,
      params.page,
      params.limit,
    ],
    queryFn: () => fetchAgendaValidations(params),
    enabled: enabled && hasContext,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}
