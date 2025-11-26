// src/hooks/study_plan/use-grade-curricular.ts
import { useQuery } from "@tanstack/react-query";
import { getGradeCurricular, GradeCurricular } from "@/services/fetch-gradeCurricularService";
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
  });
}