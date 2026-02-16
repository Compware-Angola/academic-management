import { getExamCreationPrompt } from "@/services/academiccalendar/get-exam-creation-prompt";
import { useQuery } from "@tanstack/react-query";

type UseQueryExamCreationPromptParams = {
  anoLectivo?: number;
  semestre?: number;
  typeAvaliation?: number;
};

export function useQueryExamCreationPrompt({
  anoLectivo,
  semestre,
  typeAvaliation,
}: UseQueryExamCreationPromptParams) {
  return useQuery({
    queryKey: ["exam-creation-prompt", anoLectivo, semestre, typeAvaliation],
    queryFn: () =>
      getExamCreationPrompt({
        anoLectivo: anoLectivo!,
        semestre: semestre,
        typeAvaliation: typeAvaliation,
      }),
    enabled: !!anoLectivo && !!semestre && !!typeAvaliation,
    staleTime: 1000 * 60 * 5,
  });
}
