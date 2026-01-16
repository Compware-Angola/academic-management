// hooks/financa/use-create-instituicao.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createInstituicao, CreateInstituicaoRequest } from "@/services/finance/create-instituation.service";


type CreateInstituicaoMutationInput = {
  payload: CreateInstituicaoRequest;
};

export function useCreateInstituicao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ payload }: CreateInstituicaoMutationInput) =>
      createInstituicao(payload),

    onSuccess: () => {
      toast({
        title: "Instituição criada com sucesso!",
      });

      // Se existir lista de instituições, invalida
      queryClient.invalidateQueries({
        queryKey: ["instituicao-todas"],
      });
    },

    onError: (error: any) => {
      console.error("Erro ao criar instituição:", error);

      const message =
        error?.response?.data?.message ??
        "Erro ao criar instituição";

      toast({
        title: message,
        variant: "destructive",
      });
    },
  });
}
