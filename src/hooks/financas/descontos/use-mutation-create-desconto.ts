import { useMutation } from "@tanstack/react-query";
import { createDesconto, CreateDescontoBody } from "@/services/financas/descontos/descontos.service.ts";
import { toast } from "sonner";

export function useMutationCreateDesconto() {
    return useMutation({
      mutationFn: (body: CreateDescontoBody) => createDesconto(body),
      onSuccess: () => {
          toast.success("Desconto criado com sucesso!");
          },
  });
}
