import { axiosNestGa } from "@/lib/axios-nest-ga";
export type CursoEspecialidade = {
  codigo: number;
  designacao: string;
};
export async function getCursoEspecialidade(cursoId: number) {
  const response = await axiosNestGa.get<CursoEspecialidade[]>(`/cursos/especialidades/${cursoId}`);
  return response.data;
}
