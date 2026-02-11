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
    queryKey: [
      "presence-attendance",
      params.anoLectivo,
      params.horarioPk,
      params.situacao_financeira,
      params.semestre,
      params.page,
      params.limit,
      params.codigoMatricula,
      params.nome,
    ],
    queryFn: () =>
      getPresenceAttendanceService({
        anoLectivo: params.anoLectivo,
        horarioPk: params.horarioPk,
        situacao_financeira: params.situacao_financeira,
        semestre: params.semestre,
        page: params.page,
        limit: params.limit,
        codigoMatricula: params.codigoMatricula,
        nome: params.nome,
      }),
    enabled,
  });
}
