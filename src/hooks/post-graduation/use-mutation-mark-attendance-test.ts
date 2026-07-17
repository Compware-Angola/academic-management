import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markPostGraduationTestAttendance,
  MarkPostGraduationAttendancePayload,
  MarkPostGraduationAttendanceResponse,
} from "@/services/post-graduation/mark-attendance.service";
import { POST_GRADUATION_ATTENDANCE_TESTS_QUERY_KEY } from "./use-query-attendance-tests";

export function useMutationMarkPostGraduationTestAttendance() {
  const queryClient = useQueryClient();

  return useMutation<
    MarkPostGraduationAttendanceResponse,
    Error,
    MarkPostGraduationAttendancePayload
  >({
    mutationFn: markPostGraduationTestAttendance,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [POST_GRADUATION_ATTENDANCE_TESTS_QUERY_KEY],
      });
    },
    retry: 1,
  });
}
