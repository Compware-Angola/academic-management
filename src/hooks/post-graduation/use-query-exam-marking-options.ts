import { useQuery } from "@tanstack/react-query";

import {
  fetchExamMarkingOptions,
  FetchExamMarkingOptionsParams,
  FetchExamMarkingOptionsResponse,
} from "@/services/post-graduation/fetch-exam-marking-options.service";

export const POST_GRADUATION_EXAM_MARKING_OPTIONS_QUERY_KEY =
  "post-graduation-exam-marking-options";

export function useQueryExamMarkingOptions(
  params: FetchExamMarkingOptionsParams,
) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchExamMarkingOptionsResponse>({
    queryKey: [
      POST_GRADUATION_EXAM_MARKING_OPTIONS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
    ],
    queryFn: () => fetchExamMarkingOptions(params),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
