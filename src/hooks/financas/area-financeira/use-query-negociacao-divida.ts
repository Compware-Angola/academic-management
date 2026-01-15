// src/hooks/finance/useQueryNegociacoes.ts

import {
  ObterNegociacoesPayload,
  ObterNegociacoesResponse,
  getNegociacoesService,
} from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryNegociacoes = (
  filters: ObterNegociacoesPayload,
  options?: {
    enabled?: boolean;
  }
) => {
  const {
    codigoAnoLectivo,
    codigoCurso,
    tipoNegociacaoId,
    faculdadeId,
    page = 1,
    limit = 10,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<ObterNegociacoesResponse>({
    queryKey: [
      "negociacoes",
      {
        codigoAnoLectivo,
        codigoCurso,
        tipoNegociacaoId,
        faculdadeId,
        page,
        limit,
      },
    ],
    queryFn: () => getNegociacoesService(filters),
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
