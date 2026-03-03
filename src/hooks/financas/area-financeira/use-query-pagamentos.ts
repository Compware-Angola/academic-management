// src/hooks/finance/useQueryListPayments.ts

import {
  ListPaymentsPayload,
  ListPaymentsResponse,
  getListPaymentsService,
} from "@/services/financas/nota-pagamento/fetch-payment.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryListPayments = (
  filters: ListPaymentsPayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    anoLectivo,
    codigoMatricula,
    codigoFactura,
    estado,
    nome,
    page = 1,
    limit = 25,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<ListPaymentsResponse>({
    queryKey: [
      "list-payments",
      {
        anoLectivo,
        codigoMatricula,
        codigoFactura,
        estado,
        nome,
        page,
        limit,
      },
    ],
    queryFn: () => getListPaymentsService(filters),
    enabled: enabled && !!anoLectivo, // só executa se anoLectivo existir
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
