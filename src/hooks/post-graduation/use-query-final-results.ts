import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationFinalResults,
  FetchPostGraduationFinalResultsParams,
  FetchPostGraduationFinalResultsResponse,
} from "@/services/post-graduation/fetch-final-results.service";

export const POST_GRADUATION_FINAL_RESULTS_QUERY_KEY =
  "post-graduation-final-results";

export function useQueryPostGraduationFinalResults(
  params: FetchPostGraduationFinalResultsParams,
  options?: { enabled?: boolean },
) {
  return useQuery<FetchPostGraduationFinalResultsResponse>({
    queryKey: [POST_GRADUATION_FINAL_RESULTS_QUERY_KEY, params],
    queryFn: () => fetchPostGraduationFinalResults(params),
    enabled: options?.enabled ?? true,
    retry: 1,
  });
}
