import { useMutation } from "@tanstack/react-query";
import {
  CreateDescontoBody,
  updateDesconto,
} from "@/services/financas/descontos/descontos.service.ts";
import { toast } from "sonner";

export function useMutationUpdateDesconto() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CreateDescontoBody }) =>
      updateDesconto(id, body),

    onSuccess: () => {
      toast.success("Desconto atualizado com sucesso!");
    },

    onError: (error: unknown) => {
      console.error("Erro ao atualizar desconto:", error);
      toast.error("Erro ao atualizar desconto");
    },
  });
}
