import {
  fetchDisciplinaWithFilter,
  Disciplina,
} from "@/services/disciplina/fecth-disciplina-with-filter";

import { useQuery } from "@tanstack/react-query";

type FilterDisciplinaParams = {
  curso?: string;
  semestre?: string;
  classe?: string;
};

export function useQueryDisciplinaWithFilter(
  params: FilterDisciplinaParams = {},
  options?: {
    enabled?: boolean;
  },
) {
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!params.curso && !!params.semestre && !!params.classe;
  return useQuery<Disciplina[], Error>({
    queryKey: [
      "disciplina-with-filter",
      params.classe,
      params.curso,
      params.semestre,
    ],
    queryFn: async () => {
      if (!params.curso) {
        return [];
      }
      return fetchDisciplinaWithFilter({
        classe: params.classe,
        curso: params.curso,
        semestre: params.semestre,
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
