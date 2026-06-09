
import {
    RecalculatePaymentsResponse,
    recalculatePaymentsService,
} from "@/services/financas/pagamentos-mensais/fetch-pagamentos-mensais";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationRecalculatePayments() {
    const queryClient = useQueryClient();

    return useMutation<RecalculatePaymentsResponse, Error, unknown>({
        mutationFn: async (codFactura: number) =>
            await recalculatePaymentsService(codFactura),
        onMutate: async () => {
            toast.loading("Recalculando pagamento...", {
                id: `recalculate-payment`,
            });
        },
        onSuccess: (_, codFactura) => {
            queryClient.invalidateQueries({ queryKey: ["pagamentos-mensais", { codFactura }] });
            queryClient.invalidateQueries({ queryKey: ["monthly-fees-value"] });
            toast.success("Pagamento recalculado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao recalcular pagamento!");
        },
        onSettled: () => {
            toast.dismiss(`recalculate-payment`);
        },
    });
}