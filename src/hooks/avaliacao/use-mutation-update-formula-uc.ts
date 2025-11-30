import { updateFormulaUC, UpdateFormulaUCPayload } from "@/services/avaliacao/update-formula-uc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";



export function useMutationUpdateFormulaUC() {
  const {toast} = useToast()

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFormulaUCPayload) =>
      updateFormulaUC(payload),

    onSuccess: async () => {

      await queryClient.invalidateQueries({
        queryKey: ["formula-uc"],
      });
      toast({
        title: "Fórmula da UC atualizado com sucesso.",
        variant:"default"

      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar a Fórmula da UC.",
        description: error.message??  "Ocorreu um erro ao atualizar a fórmula da UC. Tente novamente.",
        variant:"destructive"
      });

    }
  });
}
