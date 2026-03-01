import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import {
    createIsencaoServico,
    CreateIsencaoServicoBody
} from "@/services/financas/isencao-servicos/isencao-servico.service.ts";

export function useMutationCreateIsencaoServico() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateIsencaoServicoBody) => createIsencaoServico(body),

    onSuccess: () => {
      toast({
        title: "Isenção de Serviço criada com sucesso",
      });
      queryClient.invalidateQueries({
        queryKey: ["isencao-servico"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: error?.response?.data?.message ?? "Erro ao criar Isenção de Serviço",
        variant: "destructive",
      });
    },
  });
}
