import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createInstituicao } from "@/services/financas/instituicao/create-instituation.service";

export function useCreateInstituicao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: createInstituicao,
    onSuccess: () => {
      toast({
        title: "Instituição criada com sucesso!",
      });
      queryClient.invalidateQueries({
        queryKey: ["instituicao"],
      });
    },

    onError: (error: any) => {
      console.error("Erro ao criar instituição:", error);
      const message =
        error?.response?.data?.message ?? "Erro ao criar instituição";
      toast({
        title: message,
        variant: "destructive",
      });
    },
  });
}
