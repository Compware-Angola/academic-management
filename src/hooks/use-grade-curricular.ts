// src/hooks/study_plan/use-grade-curricular.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUCToPlan,
  getGradeCurricular,
  GradeCurricularPayload,
  GradeCurricularResponse,
} from "@/services/fetch-gradeCurricularService";

export function useGradeCurricular({
  anoLectivo,
  classe,
  curso,
  limit,
  page,
}: GradeCurricularPayload) {
  return useQuery<GradeCurricularResponse, Error>({
    queryKey: ["grade-curricular", anoLectivo, classe, curso, limit, page],
    queryFn: () =>
      getGradeCurricular({
        anoLectivo,
        classe,
        curso,
        limit,
        page,
      }),
    enabled: !!anoLectivo && !!curso,
    staleTime: 1000 * 60 * 10,
  });
}
export const useAddUCToPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUCToPlan,
    onSuccess: () => {
      // Invalida todas as queries de grade curricular
      queryClient.invalidateQueries({ queryKey: ["grade-curricular"] });
    },
  });
};
