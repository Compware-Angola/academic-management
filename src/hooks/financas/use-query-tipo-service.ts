// src/hooks/finance/useQueryTiposServico.ts

import {
  FetchTipoServicoPayload,
  FetchTipoServicoPayloadPaginated,
  PaginationResponse,
  TipoServicoItem,
  fetchMonthlyFeeTipoServico,
  fetchTiposServico,
  fetchTiposServicoAll,
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
export const useQueryTiposServicoAll = (
  filters: FetchTipoServicoPayloadPaginated,
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
    polo,
    page,
    limit,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<PaginationResponse<TipoServicoItem>>({
    queryKey: [
      "tipos-servico-all",
      {
        sigla,
        descricao,
        codigoAnoLectivo,
        polo,
        estado,
        tipoServico,
        visualizarNoPortal,
        page,
        limit,
      },
    ],
    queryFn: () => fetchTiposServicoAll(filters),
    enabled,
    staleTime: 1000 * 60 * 10, 
    gcTime: 1000 * 60 * 30, 
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useQueryMonthlyFeeTipoServico = (
  filters: Omit<FetchTipoServicoPayloadPaginated, "sigla">,
  options?: {
    enabled?: boolean;
  }
) => {
  const {
    codigoAnoLectivo,
    estado,
    descricao,
    tipoServico,
    polo,
    visualizarNoPortal,
    page,
    limit,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<PaginationResponse<TipoServicoItem>>({
    queryKey: [
      "tipos-servico-monthly-fee",
      {
        codigoAnoLectivo,
        estado,
        descricao,
        polo,
        tipoServico,
        visualizarNoPortal,
        page,
        limit,
      },
    ],
    queryFn: () => fetchMonthlyFeeTipoServico(filters),
    enabled,
   
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};