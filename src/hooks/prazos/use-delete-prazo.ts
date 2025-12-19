import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { deletePrazo } from "@/services/prazos/deletePrazo";

export function useDeletePrazo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deletePrazo,
    onSuccess: () => {
      toast({ title: "Prazo removido com sucesso" });
      queryClient.invalidateQueries({ queryKey: ["prazos"] });
    },
    onError: () => {
      toast({
        title: "Erro ao remover prazo",
        variant: "destructive",
      });
    },
  });
}
