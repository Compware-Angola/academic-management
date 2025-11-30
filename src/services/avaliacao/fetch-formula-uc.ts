import { axiosNestGa } from "@/lib/axios-nest-ga";


export type FOrmulaUC = {
    "codigo": number,
    "disciplina": string,
    "notaMinPratica": null | number,
    "notaMinPrimeiraFreq": null | number,
    "notaMinSegundaFreq": null | number,
    "pesoPratica": null | number,
    "pesoPrimeiraFreq": null | number,
    "pesoSegundaFreq": null | number,
};


export type FilterFormulaUCParams = {
  cursoId?: number;
  anoCurricular?: number;
  semestre?: number;
  anoLectivoId?: number;
};


export async function fetchDFormulaUC(
  params: FilterFormulaUCParams
): Promise<FOrmulaUC[]> {
  const { data } = await axiosNestGa.get(
    "assessment/unidades-curriculares",
    {
      params,
    }
  );


  return data ?? [];
}
