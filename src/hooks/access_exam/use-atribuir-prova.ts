import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atribuirProva } from "@/services/access_exam/atribuir-prova.service";
import { toast } from "@/hooks/use-toast";

export function useAtribuirProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => atribuirProva(id),
    onSuccess: (_, id) => {
      
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["resultado-prova"] });
    },
    onError: (error: any) => {
     
    },
  });
}