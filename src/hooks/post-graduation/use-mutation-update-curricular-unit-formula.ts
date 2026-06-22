import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
  updateCurricularUnitFormula,
  UpdateCurricularUnitFormulaPayload,
} from "@/services/post-graduation/update-curricular-unit-formula.service";
import { POST_GRADUATION_CURRICULAR_UNIT_FORMULAS_QUERY_KEY } from "./use-query-curricular-unit-formulas";

type UpdateCurricularUnitFormulaVariables = {
  formulaId: number;
  payload: UpdateCurricularUnitFormulaPayload;
};

export function useMutationUpdateCurricularUnitFormula() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (variables: UpdateCurricularUnitFormulaVariables) =>
      updateCurricularUnitFormula(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [POST_GRADUATION_CURRICULAR_UNIT_FORMULAS_QUERY_KEY],
      });

      toast({
        title: "Formula da UC atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Nao foi possivel atualizar a formula da UC.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
