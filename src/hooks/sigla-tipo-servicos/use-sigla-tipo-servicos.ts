import {
  createSiglaTipoServico,
  deleteSiglaTipoServico,
  fetchSiglaTipoServicos,
  FetchSiglaTipoServicosParams,
  updateSiglaTipoServico,
} from "@/services/financas/siglas-services/sigla-servicos.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sigla-tipo-servicos"] });
      toast.success("Sigla de tipo de serviço criada com sucesso!", {
        description: data?.sigla
          ? `Sigla: ${data.sigla} - ${data.descricao || ""}`
          : "Operação concluída.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar sigla de tipo de serviço", {
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });
}

export function useUpdateSiglaTipoServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSiglaTipoServico,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sigla-tipo-servicos"] });
      toast.success("Sigla de tipo de serviço atualizada com sucesso!", {
        description: data?.sigla
          ? `Sigla: ${data.sigla} - ${data.descricao || ""}`
          : "Operação concluída.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar sigla de tipo de serviço", {
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });
}

export function useDeleteSiglaTipoServico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSiglaTipoServico,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sigla-tipo-servicos"] });
      toast.success("Sigla de tipo de serviço eliminada com sucesso!", {
        description: `Código: ${variables.codigo}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao eliminar sigla de tipo de serviço", {
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });
}
