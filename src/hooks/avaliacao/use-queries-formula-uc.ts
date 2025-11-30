import { fetchDFormulaUC,FormulaUC } from "@/services/avaliacao/fetch-formula-uc";

import { useQuery } from "@tanstack/react-query";


type Params = {
  anoCurricular?: number;
  cursoId?: number;
  anoLectivoId?: number;
  semestre?: number;
};

export function useQueryFormulaUC(params: Params) {
  return useQuery<FormulaUC[], Error>({
    queryKey: ["formula-uc", params],

    enabled:
      !!params.anoCurricular &&
      !!params.anoLectivoId &&
      !!params.anoLectivoId &&
      !!params.semestre,


    queryFn: () =>
      fetchDFormulaUC({
        anoCurricular: params.anoCurricular!,
        cursoId: params.cursoId!,
        anoLectivoId: params.anoLectivoId!,
        semestre:params.semestre!,
      }),

    staleTime: 5 * 60 * 1000,
  });
}
