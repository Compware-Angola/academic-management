import {
  createSiglaTipoServico,
  deleteSiglaTipoServico,
  fetchSiglaTipoServicos,
  FetchSiglaTipoServicosParams,
  updateSiglaTipoServico,
} from "@/services/financas/siglas-services/sigla-servicos.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useQueryFetchSiglaTipoServicos(
  params: FetchSiglaTipoServicosParams,
) {
  return useQuery({
    queryKey: ["sigla-tipo-servicos", params],
    queryFn: () => fetchSiglaTipoServicos(params),
  });
}

export function useCreateSiglaTipoServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSiglaTipoServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sigla-tipo-servicos"] });
    },
  });
}

export function useUpdateSiglaTipoServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSiglaTipoServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sigla-tipo-servicos"] });
    },
  });
}

export function useDeleteSiglaTipoServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSiglaTipoServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sigla-tipo-servicos"] });
    },
  });
}
