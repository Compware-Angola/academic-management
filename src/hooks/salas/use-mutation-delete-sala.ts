
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { DeleteSala,DeleteResponse } from "@/services/salas/delete-sala";

export function useMutationDeleteSala() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id:string) => DeleteSala(id),
    onSuccess: (data:DeleteResponse) => {
      toast({
        title: data.message ,
      });
      queryClient.invalidateQueries({ queryKey: ["salas-new"] });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir sala",
      });
    },
  });
}
