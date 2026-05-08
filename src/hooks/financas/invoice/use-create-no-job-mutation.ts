import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InvoicePayload,
  InvoiceResponse,
} from "@/services/financas/invoice/create.service";

import { useToast } from "@/hooks/use-toast";
import { createInvoiceNoJobService } from "@/services/financas/invoice/create.service-no-job";

// -------------------- CREATE --------------------
export function useCreateInvoiceNoJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<InvoiceResponse, unknown, InvoicePayload>({
    mutationFn: createInvoiceNoJobService,
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.mensagem || "Fatura criada com sucesso!",
      });

      // 🔄 Invalida as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-list"] });
      queryClient.invalidateQueries({ queryKey: ["student-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["finance-monthly-fee"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description:
          error?.response?.data?.mensagem || "Erro ao criar a fatura",
        variant: "destructive",
      });
    },
  });
}
