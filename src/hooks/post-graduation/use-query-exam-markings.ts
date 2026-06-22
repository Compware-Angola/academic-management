import { useQuery } from "@tanstack/react-query";

import {
  fetchExamMarkings,
  FetchExamMarkingsParams,
  FetchExamMarkingsResponse,
} from "@/services/post-graduation/fetch-exam-markings.service";

export const POST_GRADUATION_EXAM_MARKINGS_QUERY_KEY =
  "post-graduation-exam-markings";

export function useQueryExamMarkings(params: FetchExamMarkingsParams) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId);

  return useQuery<FetchExamMarkingsResponse>({
    queryKey: [
      POST_GRADUATION_EXAM_MARKINGS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.courseId ?? null,
      params.termId ?? null,
      params.page,
      params.limit,
    ],
    queryFn: () => fetchExamMarkings(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}
