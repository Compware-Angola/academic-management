import { updateDefinirOralStatus } from "@/services/avaliacao/update-oral";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";


export function useMutationUpdateDefinirOral() {
  const {toast} = useToast()
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDefinirOralStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["definir-oral"],
      });
      toast({
        title: "Status da Oral atualizado com sucesso.",
        variant:"default"

      });

    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar o status da Oral.",
        description: error.message ?? "Ocorreu um erro ao atualizar o status da Oral. Tente novamente.",
        variant:"destructive"
      });

    }
  });
}
