import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateTipoCreditoEducacionalBody, updateTipoCreditoEducacional
} from "@/services/financas/credito-educacional/update-credito-educacional.service";

export function useUpdateTipoCreditoEducacional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateTipoCreditoEducacionalBody) =>
      updateTipoCreditoEducacional(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["credito-educacional-tipo"],
      });
    },
  });
}
