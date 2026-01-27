import { useToast } from "@/hooks/use-toast";
import { atribuirBolsa } from "@/services/financas/bolsa/atribuir-bolsa.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useMutationAtribuirBolsa() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: atribuirBolsa,
    onSuccess: () => {
      toast({
        title: "Bolsa atribuído com sucesso",
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
