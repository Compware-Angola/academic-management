import { useToast } from "@/hooks/use-toast";
import { atribuirCreditoEducacional } from "@/services/financas/credito-educacional/atribuir-credito-educacional.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useMutationAtribuirCreditoEducacional() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: atribuirCreditoEducacional,
    onSuccess: () => {
      toast({
        title: "Crédito atribuído com sucesso",
      });
      queryClient.invalidateQueries({
        queryKey: ["credito-educacional-estudante"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: error?.response?.data?.message ?? "Erro ao atribuir crédito",
        variant: "destructive",
      });
    },
  });
}
