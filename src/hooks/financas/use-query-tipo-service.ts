// src/hooks/finance/useQueryTiposServico.ts

import {
  FetchTipoServicoPayload,
  TipoServicoItem,
  fetchTiposServico,
} from "@/services/financas/fetch-tipo-servico.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryTiposServico = (
  filters: FetchTipoServicoPayload,
  options?: {
    enabled?: boolean;
  }
) => {
  const {
    sigla,
    descricao,
    codigoAnoLectivo,
    estado,
    tipoServico,
    visualizarNoPortal,
  } = filters;

  /**
   * Como todos os filtros são opcionais,
   * por padrão a query fica enabled = true.
   * O consumidor pode sobrescrever se quiser.
   */
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<TipoServicoItem[]>({
    queryKey: [
      "tipos-servico",
      {
        sigla,
        descricao,
        codigoAnoLectivo,
        estado,
        tipoServico,
        visualizarNoPortal,
      },
    ],
    queryFn: () => fetchTiposServico(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
