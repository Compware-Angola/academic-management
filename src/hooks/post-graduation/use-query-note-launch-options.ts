import { useQuery } from "@tanstack/react-query";

import {
  fetchNoteLaunchOptions,
  type FetchNoteLaunchOptionsParams,
  type FetchNoteLaunchOptionsResponse,
} from "@/services/post-graduation/fetch-note-launch-options.service";

export const POST_GRADUATION_NOTE_LAUNCH_OPTIONS_QUERY_KEY =
  "post-graduation-note-launch-options";

export function useQueryNoteLaunchOptions(
  params: FetchNoteLaunchOptionsParams,
) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchNoteLaunchOptionsResponse>({
    queryKey: [
      POST_GRADUATION_NOTE_LAUNCH_OPTIONS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
    ],
    queryFn: () => fetchNoteLaunchOptions(params),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}