import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MarcacaoProvaPrazo = {
  prazoid: number;
  designacao: string;
  tipoavaliacao: number
};
export type FilterMarcacaoProvaPrazoParams = {
  anoLectivo: number;
  semestre: number;
};

export async function fetchMarcacaoProvaPrazo(
  params: FilterMarcacaoProvaPrazoParams,
): Promise<MarcacaoProvaPrazo[]> {
  const { data } = await axiosNestGa.get(
    "/academic-activities/marcacao-prova-prazo",
    {
      params,
    },
  );

  return data?.data ?? [];
}

