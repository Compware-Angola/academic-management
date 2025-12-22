// src/hooks/useCreateLancamentoPauta.ts

import { createLancamentoPauta, CreateLancamentoPautaPayload, CreateLancamentoPautaResponse } from "@/services/avaliacao/create-lancamento-pauta";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../use-toast";
export function useCreateLancamentoPauta() {
  const queryClient = useQueryClient();
  const {toast} = useToast()
  return useMutation<
    CreateLancamentoPautaResponse,
    Error,
    CreateLancamentoPautaPayload
  >({
    mutationFn: (payload: CreateLancamentoPautaPayload) =>
      createLancamentoPauta(payload),

    // Após sucesso, invalida a cache da lista para recarregar os dados atualizados
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-pauta"] });
       toast({
        title: "Lançamento Criado com sucesso.",
        variant:"default"

      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao lançar a pauta.",
        description: error.message??  "Ocorreu um erro ao lançar a pauta. Tente novamente.",
        variant:"destructive"
      });

    }
  });
}