// src/hooks/finance/useQueryFacturaDetalhes.ts

import {
  buscarFacturaService,
  FacturaDetalhe,
} from "@/services/finance/listar-facturas.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryFacturaDetalhes = (
  facturaId?: number | string,
  options?: {
    enabled?: boolean;
  },
) => {
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!facturaId;

  return useQuery<FacturaDetalhe>({
    queryKey: ["factura-detalhes", facturaId],
    queryFn: () => buscarFacturaService(facturaId as number | string),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
