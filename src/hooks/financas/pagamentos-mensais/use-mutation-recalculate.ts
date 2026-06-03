
import {
    RecalculatePaymentsResponse,
    recalculatePaymentsService,
} from "@/services/financas/pagamentos-mensais/fetch-pagamentos-mensais";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationRecalculatePayments() {
    const queryClient = useQueryClient();

    return useMutation<RecalculatePaymentsResponse, Error, unknown>({
        mutationFn: async (codFactura: number) =>
            await recalculatePaymentsService(codFactura),
        onSuccess: (_, codFactura) => {

            queryClient.invalidateQueries({ queryKey: ["pagamentos-mensais", { codFactura }] });
        },
    });
}