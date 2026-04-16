import {
  getListPendentUCService,
  ListPendentUCPayload,
  ListPendentUCResponse,
} from "@/services/students/fetch-pendent-uc.service";
import { useQuery } from "@tanstack/react-query";

interface QueryPendentUC {
  enabled?: boolean;
}

export function useQueryStudentListPendentUC(
  payload: ListPendentUCPayload,
  options?: QueryPendentUC,
) {
  const { codigoMatricula, page, limit } = payload;

  const defaultEnabled = !!codigoMatricula;

  return useQuery<ListPendentUCResponse>({
    queryKey: ["pendent-uc", codigoMatricula, page, limit],
    queryFn: () => getListPendentUCService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
