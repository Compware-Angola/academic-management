import {
  addGradeCurricularPlanoMassa,
  AddGradeCurricularPlanoMassaPayload,
} from "@/services/disciplina/add-grade-curricular-plano-massa.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddGradeCurricularPlanoMassa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddGradeCurricularPlanoMassaPayload) =>
      addGradeCurricularPlanoMassa(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["study-plan-disciplines"],
      });

      toast.success("Plano curricular processado com sucesso!");
    },

    onError: () => {
      toast.error("Erro ao processar o plano curricular.");
    },
  });
};
