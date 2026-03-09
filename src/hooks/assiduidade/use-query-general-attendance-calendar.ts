import { useQuery } from "@tanstack/react-query";
import { fetchGeneralAttendanceCalendar, FetchGeneralAttendanceParams } from "@/services/assiduidade/fetch-general-attendance-calendar.service";

export function useQueryGeneralAttendanceCalendar(
  params: FetchGeneralAttendanceParams,
  options?: { enabled?: boolean }
) {
  const enabled =
  options?.enabled ??
  (Boolean(params?.modo) &&
    (Boolean(params?.docenteId) || Boolean(params?.docenteNome)));

  return useQuery({
    queryKey: ["assiduidade", "controle-geral-calendario", params],
    queryFn: () => fetchGeneralAttendanceCalendar(params),
    enabled,
    staleTime: 30_000,
  });
}