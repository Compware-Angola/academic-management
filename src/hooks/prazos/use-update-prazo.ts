import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePrazo } from "@/services/prazos/updatePrazo";
import { useToast } from "@/hooks/use-toast";

export function useUpdatePrazo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updatePrazo,
    onSuccess: () => {
      toast({ title: "Prazo actualizado com sucesso" });
      queryClient.invalidateQueries({ queryKey: ["prazos"] });
    },
    onError: () => {
      toast({
        title: "Erro ao actualizar prazo",
        variant: "destructive",
      });
    },
  });
}
