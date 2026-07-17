import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationAttendanceFieldSchedules,
  FetchPostGraduationAttendanceScheduleParams,
  FetchPostGraduationAttendanceScheduleResponse,
} from "@/services/post-graduation/fetch-attendance.service";

export const POST_GRADUATION_ATTENDANCE_FIELD_SCHEDULES_QUERY_KEY =
  "post-graduation-attendance-field-schedules";

export function useQueryPostGraduationAttendanceFieldSchedules(
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
    queryKey: [POST_GRADUATION_ATTENDANCE_FIELD_SCHEDULES_QUERY_KEY, params],
    queryFn: () => fetchPostGraduationAttendanceFieldSchedules(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
