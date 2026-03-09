/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSumarioParametro, UpdateParametroPayload } from "@/services/sumario/update-sumario-parametro.service";
import { toast } from "sonner";

export const useMutationUpdateParametro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateParametroPayload }) =>
      updateSumarioParametro(id, payload),
    

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sumario-parametros"] });
      toast.success("Parâmetro atualizado com sucesso!");
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.message || "Erro ao atualizar parâmetro.";
      toast.error(mensagem);
    },
  });
};