import {
  listarFacturaItensService,
  ListarFacturasPayload,
  listarFacturasService,
} from "@/services/finance/listar-facturas.service";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useQueryFacturas = (
  filters: ListarFacturasPayload,
  enabled?: boolean,
) => {
  const defaultEnabled = !!filters.search || !!filters.anoLectivo;

  return useQuery({
    queryKey: ["facturas", filters],
    queryFn: () => listarFacturasService(filters),
    enabled: enabled ?? defaultEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
export const useQueryFacturaItens = (facturaId?: number | string) => {
  const enabled = !!facturaId;

  return useQuery({
    queryKey: ["factura-itens", facturaId],
    queryFn: () => listarFacturaItensService(facturaId as number),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
