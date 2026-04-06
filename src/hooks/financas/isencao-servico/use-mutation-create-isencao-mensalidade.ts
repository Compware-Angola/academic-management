import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import {
  createIsencaoMensalidade,
  CreateIsencaoMensalidadeBody,
} from "@/services/financas/isencao-servicos/isencao-mensalidade.service.ts";

export function useMutationCreateIsencaoMensalidade() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateIsencaoMensalidadeBody) =>
      createIsencaoMensalidade(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-monthly-fee"],
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Erro ao criar Isenção de Mensalidade",
        variant: "destructive",
      });
    },
  });
}
