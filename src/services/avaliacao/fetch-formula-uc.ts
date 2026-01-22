import { axiosNestGa } from "@/lib/axios-nest-ga";


export type FormulaUC = {
    codigo: number,
    disciplina: string,
    notaMinPratica: null | number,
    notaMinPrimeiraFreq: null | number,
    notaMinSegundaFreq: null | number,
    pesoPratica: null | number,
    pesoPrimeiraFreq: null | number,
    pesoSegundaFreq: null | number,
    definido_por:null| string
};


export type FilterFormulaUCParams = {
  cursoId?: number;
  anoCurricular?: number;
  semestre?: number;
  anoLectivoId?: number;
};


export async function fetchDFormulaUC(
  params: FilterFormulaUCParams
): Promise<FormulaUC[]> {
  const { data } = await axiosNestGa.get(
    "assessment/unidades-curriculares",
    {
      params,
    }
  );


  return data ?? [];
}
