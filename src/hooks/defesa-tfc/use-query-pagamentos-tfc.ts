// src/hooks/finance/useQueryPagamentosTFC.ts

import {
  PagamentosTFCPayload,
  PagamentosTFCResponse,
  getPagamentosTFCService,
} from "@/services/defesa-tfc/pagamentos-tfc.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryPagamentosTFC = (
  filters: PagamentosTFCPayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    anoLectivo,
    curso,
    periodoId,
    facturaId,
    pagamentoId,
    matriculaId,
    nome,
    status,
    page = 1,
    limit = 25,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<PagamentosTFCResponse>({
    queryKey: [
      "pagamentos-tfc",
      {
        anoLectivo,
        curso,
        periodoId,
        status,
        nome,
        matriculaId,
        page,
        facturaId,
        pagamentoId,
        limit,
      },
    ],
    queryFn: () => getPagamentosTFCService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
