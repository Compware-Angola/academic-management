import {
  atualizarFormaPagamentoService,
  criarFormaPagamentoService,
  listarFormaPagamentoService,
  ListarFormaPagamentoPayload,
  removerFormaPagamentoService,
  toggleStatusFormaPagamentoService,
} from "@/services/finance/forma-pagamento.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useQueryFormaPagamento = (
  filters?: ListarFormaPagamentoPayload,
) => {
  return useQuery({
    queryKey: ["forma-pagamento", filters],
    queryFn: () => listarFormaPagamentoService(filters),

    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateFormaPagamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarFormaPagamentoService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forma-pagamento"],
      });
    },
  });
};

export const useUpdateFormaPagamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ codigo, payload }: { codigo: number; payload: any }) =>
      atualizarFormaPagamentoService(codigo, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forma-pagamento"],
      });
    },
  });
};

export const useToggleStatusFormaPagamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) => toggleStatusFormaPagamentoService(codigo),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forma-pagamento"],
      });
    },
  });
};

export const useDeleteFormaPagamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) => removerFormaPagamentoService(codigo),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forma-pagamento"],
      });
    },
  });
};
