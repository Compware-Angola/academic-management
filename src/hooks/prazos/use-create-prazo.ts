import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrazo } from "@/services/prazos/createPrazo";
import { useToast } from "@/hooks/use-toast";

export function useCreatePrazo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createPrazo,
    onSuccess: () => {
      toast({ title: "Prazo criado com sucesso!" });
  queryClient.invalidateQueries({ queryKey: ["prazos"] });
    },
    onError: () => {
      toast({
        title: "Erro ao criar prazo",
        variant: "destructive",
      });
    },
  });
}
