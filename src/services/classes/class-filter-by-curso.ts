import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Classes = {
designacao: string,
codigo: number
}
 type FilterDisciplinaParams = {
 curso:string
 }

export async function fetchClassByCurso(params: FilterDisciplinaParams): Promise<Classes[]> {
  const {curso} = params;
  const { data } = await axiosApexGa.get("classes_horario/filtros", { params: { p_curso: curso } });

  return data.anosCurriculares ?? [];
}
