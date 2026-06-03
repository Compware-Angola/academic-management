import {
  voidPayment,
  VoidPaymentPayload,
} from "@/services/financas/nota-pagamento/create-void-payment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVoidPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VoidPaymentPayload) => voidPayment(payload),

    onSuccess: () => {
      toast.success("Pagamento Anulado com sucesso!", {});
      queryClient.invalidateQueries({
        queryKey: ["list-payments"],
      });
    },
  });
};
