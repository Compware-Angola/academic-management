import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { updateOralCurricularUnitStatus } from "@/services/post-graduation/update-oral-curricular-unit-status.service";
import { POST_GRADUATION_ORAL_CURRICULAR_UNITS_QUERY_KEY } from "./use-query-oral-curricular-units";

type UpdateOralCurricularUnitStatusVariables = {
  curricularGradeId: number;
  enabled: boolean;
};

export function useMutationUpdateOralCurricularUnitStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (variables: UpdateOralCurricularUnitStatusVariables) =>
      updateOralCurricularUnitStatus(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [POST_GRADUATION_ORAL_CURRICULAR_UNITS_QUERY_KEY],
      });

      toast({
        title: "Configuracao da oral atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Nao foi possivel atualizar a configuracao da oral.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
