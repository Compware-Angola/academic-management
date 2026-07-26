import { axiosNestGa } from "@/lib/axios-nest-ga";
export type GradeCurricularDropDown = {
  pk: number;
  descricao: string;
  codigo: string;
};
type FilterGradeCurricularDropDownParams = {
  curso: number;
  semestre: number;
  classe: number;
  anoLectivo: number;
};

export async function fetchGradeCurricularDropDown(
  params: FilterGradeCurricularDropDownParams,
): Promise<GradeCurricularDropDown[]> {
  const { data: response } = await axiosNestGa.get(
    "dropdown-filters/grade-curricular",
    {
      params,
    },
  );

  return response.data ?? [];
}
