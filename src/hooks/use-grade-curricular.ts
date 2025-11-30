// src/hooks/study_plan/use-grade-curricular.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUCToPlan, getGradeCurricular, GradeCurricular } from "@/services/fetch-gradeCurricularService";
import axios from "axios";
interface UseGradeCurricularParams {
  anolectivoId: number;
  cursoId: number;
  classId: number;
  enabled?: boolean;
}

export function useGradeCurricular({
  anolectivoId,
  cursoId,
  classId,
  enabled = true,
}: UseGradeCurricularParams) {
  return useQuery<GradeCurricular[], Error>({
    queryKey: ["grade-curricular", anolectivoId, cursoId, classId],
    queryFn: () => getGradeCurricular(anolectivoId, cursoId, classId),
    enabled: enabled && anolectivoId > 0 && cursoId > 0 && classId > 0,
    staleTime: 1000 * 60 * 10, 
  }

);
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