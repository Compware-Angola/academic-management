import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetarProva } from "@/services/access_exam/resetar-prova.service";
import { toast } from "@/hooks/use-toast";

export function useResetarProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => resetarProva(id),
    onSuccess: (_, id) => {
      
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
    },
    onError: (error: any) => {
   
    },
  });
}