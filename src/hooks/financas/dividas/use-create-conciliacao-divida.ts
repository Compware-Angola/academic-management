import {
  createConciliacaoDivida,
  CreateConciliacaoDividaPayload,
} from "@/services/financas/conciliacao-divida";
import { useMutation } from "@tanstack/react-query";

export const useCreateConciliacaoDivida = () => {
  return useMutation({
    mutationFn: (payload: CreateConciliacaoDividaPayload) =>
      createConciliacaoDivida(payload),
  });
};
