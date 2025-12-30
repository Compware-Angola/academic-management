import { useQuery } from "@tanstack/react-query";
import {
  getPresenceAttendanceService,
  PresencaEstudante,
  PresencaQuery,
} from "@/services/avaliacao/fetch-presence-attendance";

export function usePresenceAttendance(
  params: Partial<PresencaQuery>,
  enabled: boolean
) {
  return useQuery<PresencaEstudante[]>({
    queryKey: ["presence-attendance", params],
    queryFn: () =>
      getPresenceAttendanceService({
        anoLectivo: params.anoLectivo,
        horarioPk: params.horarioPk,
        situacao_financeira: params.situacao_financeira,
        tipo_avaliacao: params.tipo_avaliacao,
      }),
    enabled,
  });
}
