import { useQuery } from "@tanstack/react-query";
import { getGradesCreationPrompt } from "@/services/academiccalendar/get-grades-creation-prompt";

type UseQueryGradesCreationPromptParams = {
  anoLectivo?: number;
  semestre?: number;
  typeAvaliation?: number;
};

export function useQueryGradesCreationPrompt({
  anoLectivo,
  semestre,
  typeAvaliation,
}: UseQueryGradesCreationPromptParams) {
  return useQuery({
    queryKey: ["grades-creation-prompt", anoLectivo, semestre, typeAvaliation],
    queryFn: () =>
      getGradesCreationPrompt({
        anoLectivo: anoLectivo!,
        semestre: semestre,
        typeAvaliation: typeAvaliation,
      }),
    enabled: !!anoLectivo && !!semestre && !!typeAvaliation,
    staleTime: 1000 * 60 * 5,
  });
}
