import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import {
  createIsencaoMulta,
  CreateIsencaoMultaBody,
} from "@/services/financas/isencao-servicos/isencao-multa.service";

export function useMutationCreateIsencaoMulta() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateIsencaoMultaBody) => createIsencaoMulta(body),

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
