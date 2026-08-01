import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type Classes = {
  designacao: string;
  codigo: number;
};

type FilterDisciplinaParams = {
  curso: string;
};

export async function fetchClassByCurso(
  params: FilterDisciplinaParams,
): Promise<Classes[]> {
  const { curso } = params;

  const { data } = await axiosNestGa.get(
    `dropdown-filters/ano-curricular/${curso}`,
  );
  // const { data } = await axiosApexGa.get("classes_horario/filtros", { params: { p_curso: curso } });

  return data ?? [];
}