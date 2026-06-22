import { useQuery } from "@tanstack/react-query";

import {
  fetchAgendaLaunches,
  FetchAgendaLaunchesParams,
  FetchAgendaLaunchesResponse,
} from "@/services/post-graduation/fetch-agenda-launches.service";

export const POST_GRADUATION_AGENDA_LAUNCHES_QUERY_KEY =
  "post-graduation-agenda-launches";

export function useQueryAgendaLaunches(
  params: FetchAgendaLaunchesParams,
) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchAgendaLaunchesResponse>({
    queryKey: [
      POST_GRADUATION_AGENDA_LAUNCHES_QUERY_KEY,
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
    queryFn: () => fetchAgendaLaunches(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}
