import { axiosNestGa } from "@/lib/axios-nest-ga";
export type CursoItem = {
  codigo: number;
  designacao: string;
};

export type CursosResponse = {
  data: CursoItem[];
};

export async function getDocenteCursosService(
  docenteId: number,
): Promise<CursosResponse> {
  const { data } = await axiosNestGa.get<CursosResponse>(
    `docentes/${docenteId}/cursos`,
  );

  return data;
}
