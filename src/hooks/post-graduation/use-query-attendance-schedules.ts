import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationAttendanceSchedules,
  FetchPostGraduationAttendanceScheduleParams,
  FetchPostGraduationAttendanceScheduleResponse,
} from "@/services/post-graduation/fetch-attendance.service";

export const POST_GRADUATION_ATTENDANCE_SCHEDULES_QUERY_KEY =
  "post-graduation-attendance-schedules";

export function useQueryPostGraduationAttendanceSchedules(
  params: FetchPostGraduationAttendanceScheduleParams,
  options?: { enabled?: boolean },
) {
  const hasAcademicYear =
    params.anoLectivo !== undefined && Number(params.anoLectivo) > 0;
  const hasDates =
    !!params.dataInicial &&
    !!params.dataFinal &&
    !Number.isNaN(Date.parse(params.dataInicial)) &&
    !Number.isNaN(Date.parse(params.dataFinal));
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled && hasAcademicYear && hasDates
      : hasAcademicYear && hasDates;

  return useQuery<FetchPostGraduationAttendanceScheduleResponse>({
    queryKey: [POST_GRADUATION_ATTENDANCE_SCHEDULES_QUERY_KEY, params],
    queryFn: () => fetchPostGraduationAttendanceSchedules(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
