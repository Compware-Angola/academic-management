import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateTipoCreditoEducacionalBody, createTipoCreditoEducacional
} from "@/services/financas/credito-educacional/create-credito-educacional.service";

export function useCreateTipoCreditoEducacional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTipoCreditoEducacionalBody) =>
      createTipoCreditoEducacional(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["credito-educacional-tipo"],
      });
    },
  });
}
