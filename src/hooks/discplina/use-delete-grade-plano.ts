import {
  DeletePlanoCurricularResponse,
  DeletePlanoCurricularParams,
  deletePlanoCurricularService,
} from "@/services/fetch-gradeCurricularService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationDeletePlanoCurricular = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeletePlanoCurricularResponse,
    Error,
    DeletePlanoCurricularParams
  >({
    mutationFn: deletePlanoCurricularService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departamento-uc"],
      });
      queryClient.invalidateQueries({
        queryKey: ["grade-curricular"],
      });
    },
  });
};
