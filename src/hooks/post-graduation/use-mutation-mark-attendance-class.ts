import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markPostGraduationClassAttendance,
  MarkPostGraduationAttendancePayload,
  MarkPostGraduationAttendanceResponse,
} from "@/services/post-graduation/mark-attendance.service";
import { POST_GRADUATION_ATTENDANCE_CONTROL_QUERY_KEY } from "./use-query-attendance-control";
import { POST_GRADUATION_ATTENDANCE_FIELD_SCHEDULES_QUERY_KEY } from "./use-query-attendance-field-schedules";
import { POST_GRADUATION_ATTENDANCE_SCHEDULES_QUERY_KEY } from "./use-query-attendance-schedules";

export function useMutationMarkPostGraduationClassAttendance() {
  const queryClient = useQueryClient();

  return useMutation<
    MarkPostGraduationAttendanceResponse,
    Error,
    MarkPostGraduationAttendancePayload
  >({
    mutationFn: markPostGraduationClassAttendance,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_ATTENDANCE_SCHEDULES_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_ATTENDANCE_FIELD_SCHEDULES_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_ATTENDANCE_CONTROL_QUERY_KEY],
        }),
      ]);
    },
    retry: 1,
  });
}
