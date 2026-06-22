import { useQuery } from "@tanstack/react-query";

import {
  fetchAgendaLaunchOptions,
  FetchAgendaLaunchOptionsParams,
  FetchAgendaLaunchOptionsResponse,
} from "@/services/post-graduation/fetch-agenda-launch-options.service";

export const POST_GRADUATION_AGENDA_LAUNCH_OPTIONS_QUERY_KEY =
  "post-graduation-agenda-launch-options";

export function useQueryAgendaLaunchOptions(
  params: FetchAgendaLaunchOptionsParams,
) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchAgendaLaunchOptionsResponse>({
    queryKey: [
      POST_GRADUATION_AGENDA_LAUNCH_OPTIONS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
    ],
    queryFn: () => fetchAgendaLaunchOptions(params),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
