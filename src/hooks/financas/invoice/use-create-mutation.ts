import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createInvoiceService,
    InvoicePayload,
    InvoiceResponse
} from "@/services/financas/invoice/create.service";

import { useToast } from "@/hooks/use-toast";

// -------------------- CREATE --------------------
export function useCreateInvoice() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<InvoiceResponse, unknown, InvoicePayload>({
        mutationFn: createInvoiceService,
        onSuccess: (data) => {
            toast({
                title: "Sucesso",
                description: data.mensagem || "Fatura criada com sucesso!",
            });

            // 🔄 Invalida as queries relacionadas
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoices-list"] });
            queryClient.invalidateQueries({ queryKey: ["student-invoices"] });
        },
        onError: (error: any) => {
            toast({
                title: "Erro",
                description: error?.response?.data?.mensagem || "Erro ao criar a fatura",
                variant: "destructive",
            });
        },
    });
}

