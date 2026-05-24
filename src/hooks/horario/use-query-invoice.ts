import {
  annulInvoiceService,
  reactivateInvoiceService,
  listarFacturaItensService,
  ListarFacturasPayload,
  listarFacturasService,
} from "@/services/finance/listar-facturas.service";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// =============================
// 🔎 LISTAR FACTURAS
// =============================
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

// =============================
// 📄 LISTAR ITENS DA FACTURA
// =============================
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

// =============================
// ❌ ANULAR FACTURA
// =============================
export const useAnnulInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ facturaId, motivo }: { facturaId: number, motivo: string }) => annulInvoiceService({ facturaId, motivo }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      toast.success(data.mensagem);

    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    }
  });
};

// =============================
// ♻️ REACTIVAR FACTURA
// =============================
export const useReactivateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (facturaId: number) => reactivateInvoiceService(facturaId),

    onSuccess: () => {
      // 🔥 Atualiza automaticamente a listagem geral
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};
