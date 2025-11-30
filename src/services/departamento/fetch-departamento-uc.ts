import { axiosApexGa } from "@/lib/axios-apex-ga";
export type DepartamentoUC = {
"codigo_grade": number,
"disciplina": string,
"classe": string,
"semestre": string
}
 type DepartamentoUCParams = {
  departamento: string;
  semestre: string;
  classe: string;
 }

export async function fetchDepartamentoUC(params: DepartamentoUCParams): Promise<DepartamentoUC[]> {
  const { departamento,semestre,classe } = params;
  const { data } = await axiosApexGa.get(`ga/curricular-unit/department/${departamento}/${classe}/${semestre}`);

  return data.unidade_curriculares ?? [];
}
