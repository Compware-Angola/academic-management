import { useToast } from "@/hooks/use-toast";
import {
  createConciliacaoDivida,
  CreateConciliacaoDividaPayload,
} from "@/services/financas/conciliacao-divida";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateConciliacaoDivida = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConciliacaoDividaPayload) =>
      createConciliacaoDivida(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["conciliacao-dividas"],
      });
      toast({
        title: "Conciliação de Divida",
        description: "Conciliação de Divida Gerada com sucesso",
      });
    },
  });
};
