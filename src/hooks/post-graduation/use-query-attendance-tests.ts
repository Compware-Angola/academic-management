import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationAttendanceTests,
  FetchPostGraduationAttendanceTestParams,
  FetchPostGraduationAttendanceTestResponse,
} from "@/services/post-graduation/fetch-attendance.service";

export const POST_GRADUATION_ATTENDANCE_TESTS_QUERY_KEY =
  "post-graduation-attendance-tests";

export function useQueryPostGraduationAttendanceTests(
  params: FetchPostGraduationAttendanceTestParams,
  options?: { enabled?: boolean },
) {
  const hasAcademicYear =
    params.anoLectivo !== undefined && Number(params.anoLectivo) > 0;
  const hasDates =
    !!params.dataInicio &&
    !!params.dataFim &&
    !Number.isNaN(Date.parse(params.dataInicio)) &&
    !Number.isNaN(Date.parse(params.dataFim));
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled && hasAcademicYear && hasDates
      : hasAcademicYear && hasDates;

  return useQuery<FetchPostGraduationAttendanceTestResponse>({
    queryKey: [POST_GRADUATION_ATTENDANCE_TESTS_QUERY_KEY, params],
    queryFn: () => fetchPostGraduationAttendanceTests(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
