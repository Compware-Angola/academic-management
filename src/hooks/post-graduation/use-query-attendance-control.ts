import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationAttendanceControl,
  FetchPostGraduationAttendanceControlParams,
  FetchPostGraduationAttendanceControlResponse,
} from "@/services/post-graduation/fetch-attendance.service";

export const POST_GRADUATION_ATTENDANCE_CONTROL_QUERY_KEY =
  "post-graduation-attendance-control";

export function useQueryPostGraduationAttendanceControl(
  params: FetchPostGraduationAttendanceControlParams,
  options?: { enabled?: boolean },
) {
  const hasDates =
    !!params.dataInicial &&
    !!params.dataFinal &&
    !Number.isNaN(Date.parse(params.dataInicial)) &&
    !Number.isNaN(Date.parse(params.dataFinal));
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled && hasDates
      : hasDates;

  return useQuery<FetchPostGraduationAttendanceControlResponse>({
    queryKey: [POST_GRADUATION_ATTENDANCE_CONTROL_QUERY_KEY, params],
    queryFn: () => fetchPostGraduationAttendanceControl(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
