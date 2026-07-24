import { useMutation, useQuery } from "@tanstack/react-query";
import {
  exportPresenceAttendanceService,
  getPresenceAttendanceService,
  PresencaEstudante,
  PresencaExport,
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
      params.tipo_avaliacao,
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
        tipo_avaliacao: params.tipo_avaliacao,
      }),
    enabled,
  });
}

export type UsePresenceAttendanceExportOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function usePresenceAttendanceExport(
  params: Omit<PresencaQuery, "page" | "limit">,
  options?: UsePresenceAttendanceExportOptions,
) {
  return useMutation<PresencaExport, Error>({
    mutationFn: () =>
      exportPresenceAttendanceService({
        anoLectivo: params.anoLectivo,
        horarioPk: params.horarioPk,
        situacao_financeira: params.situacao_financeira,
        semestre: params.semestre,
        codigoMatricula: params.codigoMatricula,
        nome: params.nome,
        tipo_avaliacao: params.tipo_avaliacao,
      }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
