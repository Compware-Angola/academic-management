import {
  fetchGradeCurricularDropDown,
  GradeCurricularDropDown,
} from "@/services/disciplina/fetch-grade-curricular-dropdown";
import { useQuery } from "@tanstack/react-query";

type FilterDisciplinaParams = {
  curso?: number;
  semestre?: number;
  classe?: number;
  anoLectivo?: number;
};

export function useQueryGradeCurricularDropDown(
  params: FilterDisciplinaParams = {},
  options?: {
    enabled?: boolean;
  },
) {
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!params.curso;

  return useQuery<GradeCurricularDropDown[], Error>({
    queryKey: [
      "grade-curricular-dropdown",
      params.curso,
      params.semestre,
      params.classe,
      params.anoLectivo,
    ],
    queryFn: async () => {
      if (!params.curso) {
        return [];
      }

      return fetchGradeCurricularDropDown({
        curso: params.curso,
        semestre: params.semestre,
        classe: params.classe,
        anoLectivo: params.anoLectivo,
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
