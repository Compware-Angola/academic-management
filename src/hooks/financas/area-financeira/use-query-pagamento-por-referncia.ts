// src/hooks/finance/useQueryReferenciasPagamento.ts

import {
  ObterReferenciasPagamentoPayload,
  ObterReferenciasPagamentoResponse,
  getPaymentReferencesService,
} from "@/services/financas/area-financeira/fetch-pagamento-por-referencia.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryReferenciasPagamento = (
  filters: ObterReferenciasPagamentoPayload,
  options?: {
    enabled?: boolean;
  }
) => {
  const {
    dataInicio,
    dataFinal,
    codigoproduto,
    status,
    codigoFactura,
    codigoMatricula,
    reference,
    anoLectivo,
    page = 1,
    limit = 10,
  } = filters;

  /**
   * Como todos os filtros são opcionais,
   * por padrão a query fica enabled = true.
   * O consumidor pode sobrescrever se quiser.
   */
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<ObterReferenciasPagamentoResponse>({
    queryKey: [
      "referencias-pagamento",
      {
        dataInicio,
        dataFinal,
        codigoproduto,
        status,
        codigoFactura,
        codigoMatricula,
        reference,
        anoLectivo,
        page,
        limit,
      },
    ],
    queryFn: () => getPaymentReferencesService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,

    refetchOnReconnect: true,
  });
};
