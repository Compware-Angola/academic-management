import { useQuery } from "@tanstack/react-query";

import {
  fetchAttendanceList,
  FetchAttendanceListParams,
  FetchAttendanceListResponse,
} from "@/services/post-graduation/fetch-exam-attendance-list.service";

export const POST_GRADUATION_ATTENDANCE_LIST_QUERY_KEY =
  "post-graduation-attendance-list";

export function useQueryAttendanceList(params: FetchAttendanceListParams) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId) &&
    params.periodId > 0 &&
    params.courseId > 0 &&
    params.curricularYearId > 0 &&
    params.curricularGradeId > 0 &&
    params.scheduleId > 0;

  return useQuery<FetchAttendanceListResponse>({
    queryKey: [
      POST_GRADUATION_ATTENDANCE_LIST_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.periodId,
      params.courseId,
      params.curricularYearId,
      params.curricularGradeId,
      params.scheduleId,
      params.search ?? "",
      params.page,
      params.limit,
    ],
    queryFn: () => fetchAttendanceList(params),
    enabled,
    retry: 1,
  });
}
