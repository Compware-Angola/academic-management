import { useMutation } from "@tanstack/react-query";
import { createDescontoAdd, CreateDescontoAddBody } from "@/services/financas/descontos/descontos.service.ts";
import { toast } from "sonner";

export function useMutationCreateDescontoAdd() {
  return useMutation({
    mutationFn: (body: CreateDescontoAddBody) => createDescontoAdd(body),
    onSuccess: () => {
      toast.success("Atribuição de desconto criada com sucesso!");
    },
    onError: (error: unknown) => {
      console.error("Erro ao criar atribuição de desconto:", error);
      toast.error("Erro ao atribuir desconto");
    },
  });
}
