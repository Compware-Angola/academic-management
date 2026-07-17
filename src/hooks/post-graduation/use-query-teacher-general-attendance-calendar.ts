import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationTeacherGeneralCalendar,
  FetchPostGraduationTeacherGeneralCalendarParams,
} from "@/services/post-graduation/fetch-attendance.service";
import { GeneralAttendanceResponse } from "@/util/types";

export const POST_GRADUATION_TEACHER_GENERAL_ATTENDANCE_CALENDAR_QUERY_KEY =
  "post-graduation-teacher-general-attendance-calendar";

export function useQueryPostGraduationTeacherGeneralAttendanceCalendar(
  params: FetchPostGraduationTeacherGeneralCalendarParams,
  options?: { enabled?: boolean },
) {
  const hasDegree = params.degreeId !== undefined && Number(params.degreeId) > 0;
  const hasTeacher = Boolean(params.docenteId) || Boolean(params.docenteNome);
  const hasMode = Boolean(params.modo);
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled && hasDegree && hasTeacher && hasMode
      : hasDegree && hasTeacher && hasMode;

  return useQuery<GeneralAttendanceResponse>({
    queryKey: [
      POST_GRADUATION_TEACHER_GENERAL_ATTENDANCE_CALENDAR_QUERY_KEY,
      params,
    ],
    queryFn: () => fetchPostGraduationTeacherGeneralCalendar(params),
    enabled,
    staleTime: 30_000,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
