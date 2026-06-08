import {
  ListPagamentosMensaisPayload,
  ListPagamentosMensaisResponse,
  getListPagamentosMensaisService,
} from "@/services/financas/pagamentos-mensais/fetch-pagamentos-mensais";
import { useQuery } from "@tanstack/react-query";

interface QueryPagamentosMensaisOptions {
  enabled?: boolean;
}

export function useQueryListPagamentosMensais(
  payload: ListPagamentosMensaisPayload,
  options?: QueryPagamentosMensaisOptions,
) {
  const defaultEnabled = !!payload.codigoAnoLectivo;

  return useQuery<ListPagamentosMensaisResponse>({
    queryKey: ["pagamentos-mensais", payload],
    queryFn: () => getListPagamentosMensaisService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
