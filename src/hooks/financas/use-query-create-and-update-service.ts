import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTipoServicoService, updateTipoServicoService, TipoServicoPayload, UpdateTipoServicoPayload, TipoServicoResponse } from "@/services/financas/create-and-update-service.service";
import { useToast } from "@/hooks/use-toast";

// -------------------- CREATE --------------------
export function useCreateTipoServico() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<TipoServicoResponse, unknown, TipoServicoPayload>({
    mutationFn: createTipoServicoService,
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.mensagem,
      });
      // 🔄 Invalida a query de listagem para atualizar a tabela
      queryClient.invalidateQueries({ queryKey: ["tipos-servico-all"] });
      queryClient.invalidateQueries({ queryKey: ["tipos-servico-monthly-fee"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.response?.data?.mensagem || "Erro ao criar o serviço",
        variant: "destructive",
      });
    },
  });
}

// -------------------- UPDATE --------------------
export function useUpdateTipoServico(codigo: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<TipoServicoResponse, unknown, UpdateTipoServicoPayload>({
    mutationFn: (payload) => updateTipoServicoService(codigo, payload),
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.mensagem,
      });
      // 🔄 Atualiza a lista de serviços após update
      queryClient.invalidateQueries({ queryKey: ["tipos-servico-all"] });
      queryClient.invalidateQueries({ queryKey: ["tipos-servico-monthly-fee"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.response?.data?.mensagem || "Erro ao atualizar o serviço",
        variant: "destructive",
      });
    },
  });
}
