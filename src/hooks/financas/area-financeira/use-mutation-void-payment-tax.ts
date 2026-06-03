import {
  VoidPaymentPayloadTax,
  voidPaymentTax,
} from "@/services/financas/nota-pagamento/create-void-payment-tax.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVoidPaymentTax = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VoidPaymentPayloadTax) => voidPaymentTax(payload),
    onSuccess: () => {
      toast.success("Multa de Pagamento Anulado com sucesso!", {});
      queryClient.invalidateQueries({
        queryKey: ["list-payments"],
      });
    },
  });
};
