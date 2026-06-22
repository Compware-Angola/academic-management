import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ListarPagamentoBolsaConciliacaoInsightsParams,
  ListarPagamentoBolsaConciliacaoResumoParams,
  ListarPagamentoBolsaEstudantesParams,
  ListarPagamentoBolsaParams,
  UpdatePagamentoBolsaPayload,
  criarPagamentoBolsa,
  deletePagamentoBolsa,
  listarPagamentoBolsa,
  listarPagamentoBolsaConciliacaoInsights,
  listarPagamentoBolsaConciliacaoResumo,
  listarPagamentoBolsaEstudantes,
  updatePagamentoBolsa,
} from "@/services/financas/bolsa/pagamento-bolsa.service";
import { toast } from "sonner";

export const useListarPagamentoBolsa = (
  params?: ListarPagamentoBolsaParams,
) => {
  return useQuery({
    queryKey: [
      "bolsa",
      "pagamentos",
      params?.anoLectivo,
      params?.semestre,
      params?.codigoBolsa,
      params?.codigoInstituicao,
      params?.page,
      params?.limit,
    ],
    queryFn: () => listarPagamentoBolsa(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCriarPagamentoBolsa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarPagamentoBolsa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bolsa", "pagamentos"],
      });
      toast.success("Pagamento bolsa criado com sucesso!");
    },
  });
};

export const useUpdatePagamentoBolsa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePagamentoBolsa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bolsa", "pagamentos"],
      });
      toast.success("Pagamento bolsa actualizado com sucesso!");
    },
  });
};

export const useDeletePagamentoBolsa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePagamentoBolsa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bolsa", "pagamentos"],
      });
      toast.success("Pagamento bolsa eliminado com sucesso!");
    },
  });
};

export const useListarPagamentoBolsaEstudantes = (
  params?: ListarPagamentoBolsaEstudantesParams,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["pagamento-bolsa-estudantes", params],
    queryFn: () => listarPagamentoBolsaEstudantes(params),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useConciliacaoFinanceira = (
  params?: ListarPagamentoBolsaConciliacaoResumoParams,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["pagamento-bolsa-conciliacao-resumo", params],
    queryFn: () => listarPagamentoBolsaConciliacaoResumo(params),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useListarPagamentoBolsaConciliacaoInsights = (
  params?: ListarPagamentoBolsaConciliacaoInsightsParams,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["pagamento-bolsa-conciliacao-insights", params],
    queryFn: () => listarPagamentoBolsaConciliacaoInsights(params),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

