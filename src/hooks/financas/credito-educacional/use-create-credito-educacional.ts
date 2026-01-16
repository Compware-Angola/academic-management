import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCreditoEducacional,
  CreateCreditoEducacionalBody,
} from "@/services/financas/credito-educacional/create-credito-educacional.service";

export function useCreateCreditoEducacional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCreditoEducacionalBody) =>
      createCreditoEducacional(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["credito-educacional"],
      });
    },
  });
}
