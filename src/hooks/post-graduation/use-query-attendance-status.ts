import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationAttendanceStatus,
  PostGraduationAttendanceStatus,
} from "@/services/post-graduation/fetch-attendance.service";

export const POST_GRADUATION_ATTENDANCE_STATUS_QUERY_KEY =
  "post-graduation-attendance-status";

export function useQueryPostGraduationAttendanceStatus(
  options?: { enabled?: boolean },
) {
  return useQuery<PostGraduationAttendanceStatus[]>({
    queryKey: [POST_GRADUATION_ATTENDANCE_STATUS_QUERY_KEY],
    queryFn: fetchPostGraduationAttendanceStatus,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
