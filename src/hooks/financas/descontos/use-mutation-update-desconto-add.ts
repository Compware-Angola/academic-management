import { useMutation } from "@tanstack/react-query";
import {
    CreateDescontoAddBody,
    updateDescontoAdd
} from "@/services/financas/descontos/descontos.service.ts";
import { toast } from "sonner";

export function useMutationUpdateDescontoAdd() {
  return useMutation({
    mutationFn: ({id, body}: {id: number, body: CreateDescontoAddBody}) => updateDescontoAdd(id, body),
    onSuccess: () => {
      toast.success("Atribuição de desconto atualizada com sucesso!");
    },
    onError: (error: unknown) => {
      console.error("Erro ao atualizar atribuição de desconto:", error);
      toast.error("Erro ao atribuir desconto");
    },
  });
}
