import { useQuery } from "@tanstack/react-query";
import {
  getPresenceAttendanceService,
  PresencaEstudante,
  PresencaQuery,
} from "@/services/avaliacao/fetch-presence-attendance";

export function usePresenceAttendance(
  params: Partial<PresencaQuery>,
  enabled: boolean,
) {
  return useQuery<PresencaEstudante>({
    queryKey: ["presence-attendance", params.anoLectivo, params.horarioPk],
    queryFn: () =>
      getPresenceAttendanceService({
        anoLectivo: params.anoLectivo,
        horarioPk: params.horarioPk,
      }),
    enabled,
  });
}
