import {
  createPayment,
  CreatePaymentPayload,
} from "@/services/financas/nota-pagamento/create-nota-pagamento.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => createPayment(payload),
    onSuccess: () => {
      toast.success("Pagamento criado com sucesso!", {
        id: "create-payment-success",
      });
      // Invalida queries relacionadas a pagamentos para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
    onError: () => {
      // toast.error("Erro ao criar pagamento", { id: "create-payment-error" });
    },
  });
}
