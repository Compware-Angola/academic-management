// src/hooks/finance/useQueryNegociacoes.ts

import {
  ObterNegociacoesPayload,
  ObterNegociacoesResponse,
  deleteNegociacaoService,
  getNegociacoesService,
} from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useQueryNegociacoes = (
  filters: ObterNegociacoesPayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    codigoAnoLectivo,
    codigoCurso,
    tipoNegociacaoId,
    faculdadeId,
    codigoMatricula,
    nome,
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

export const useDeleteNegociacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNegociacaoService(id),
    onSuccess: () => {
      toast.success("Negociação de dívida eliminada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["negociacoes"],
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao eliminar negociação de dívida", {
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });
};
