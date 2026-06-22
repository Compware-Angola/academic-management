import { useQuery } from "@tanstack/react-query";

import {
  fetchExamCalendars,
  FetchExamCalendarsParams,
  FetchExamCalendarsResponse,
} from "@/services/post-graduation/fetch-exam-calendars.service";

export function useQueryExamCalendars(params: FetchExamCalendarsParams) {
  const hasValidFilters =
    Number.isInteger(params.academicYearId) &&
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId);

  return useQuery<FetchExamCalendarsResponse>({
    queryKey: [
      "post-graduation-exam-calendars",
      params.academicYearId,
      params.degreeId,
    ],
    queryFn: () => fetchExamCalendars(params),
    enabled: hasValidFilters,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
