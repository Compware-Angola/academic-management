import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateFormulaUCPayload = {
  codigo: number;

  notaMinPratica: number | null;
  pesoPratica: number | null;

  notaMinPrimeiraFreq: number | null;
  pesoPrimeiraFreq: number | null;

  notaMinSegundaFreq: number | null;
  pesoSegundaFreq: number | null;
};

export async function updateFormulaUC(
  payload: UpdateFormulaUCPayload
): Promise<void> {

  await axiosNestGa.put(
    "assessment/unidades-curriculares",
    payload
  );

}
