import { useToast } from "@/hooks/use-toast";
import { updateInstituicao } from "@/services/financas/instituicao/update-instituicao.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateInstituicao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateInstituicao,
    onSuccess: () => {
      toast({
        title: "Instituição atualizada com sucesso!",
      });
      queryClient.invalidateQueries({
        queryKey: ["instituicao"],
      });
    },

    onError: (error: any) => {
      console.error("Erro ao atualizar instituição:", error);
      const message =
        error?.response?.data?.message ?? "Erro ao atualizar instituição";
      toast({
        title: message,
        variant: "destructive",
      });
    },
  });
}
