import { useQuery } from "@tanstack/react-query";

import {
  fetchAgendaValidationOptions,
  FetchAgendaValidationOptionsParams,
  FetchAgendaValidationOptionsResponse,
} from "@/services/post-graduation/fetch-agenda-validation-options.service";

export const POST_GRADUATION_AGENDA_VALIDATION_OPTIONS_QUERY_KEY =
  "post-graduation-agenda-validation-options";

export function useQueryAgendaValidationOptions(
  params: FetchAgendaValidationOptionsParams,
) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchAgendaValidationOptionsResponse>({
    queryKey: [
      POST_GRADUATION_AGENDA_VALIDATION_OPTIONS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
    ],
    queryFn: () => fetchAgendaValidationOptions(params),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
