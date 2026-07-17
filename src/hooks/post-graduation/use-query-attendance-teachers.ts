import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationAttendanceTeachers,
  FetchPostGraduationAttendanceTeachersParams,
  PostGraduationAttendanceTeacher,
} from "@/services/post-graduation/fetch-attendance.service";

export const POST_GRADUATION_ATTENDANCE_TEACHERS_QUERY_KEY =
  "post-graduation-attendance-teachers";

export function useQueryPostGraduationAttendanceTeachers(
  params: FetchPostGraduationAttendanceTeachersParams,
  options?: { enabled?: boolean },
) {
  const hasDegree = params.degreeId !== undefined && Number(params.degreeId) > 0;
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled && hasDegree
      : hasDegree;

  return useQuery<PostGraduationAttendanceTeacher[]>({
    queryKey: [POST_GRADUATION_ATTENDANCE_TEACHERS_QUERY_KEY, params],
    queryFn: () => fetchPostGraduationAttendanceTeachers(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
