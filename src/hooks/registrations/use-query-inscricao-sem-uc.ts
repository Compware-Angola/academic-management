import {
  ListInscricaoSemUcPayload,
  ListInscricaoSemUcResponse,
  getListInscricaoSemUcService,
} from "@/services/registrations/fetch-inscricao-sem-uc.service";
import { useQuery } from "@tanstack/react-query";

interface QueryInscricao {
  enabled?: boolean;
}

export function useQueryListInscricaoSemUc(
  payload: ListInscricaoSemUcPayload,
  options?: QueryInscricao,
) {
  const { codigoAnoLectivo, codigoCurso, grade, page, limit } = payload;

  const defaultEnabled = !!codigoAnoLectivo && !!codigoCurso && !!grade;

  return useQuery<ListInscricaoSemUcResponse>({
    queryKey: ["inscricao", codigoAnoLectivo, codigoCurso, grade, page, limit],
    queryFn: () => getListInscricaoSemUcService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
