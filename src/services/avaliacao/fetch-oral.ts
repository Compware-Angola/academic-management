import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DefinirOral = {
  codigoGrade: number;
  disciplina: string;
  habilitar: boolean;
};

export type FilterDefinirOralParams = {
  cursoId?: number;
  anoCurricular?: number;
  semestre?: number;
};


export async function fetchDefinirOral(
  params: FilterDefinirOralParams
): Promise<DefinirOral[]> {
  const { data } = await axiosNestGa.get(
    "assessment/definir/oral",
    { params }
  );

  return data ?? [];
}
