import { axiosNestGa } from "@/lib/axios-nest-ga";
export type CursoEspecialidade = {
  codigo: number;
  designacao: string;
};
export type CursoBase = {
  codigo: number;
  designacao: string;
};
export async function getCursoEspecialidadePorCodigoMatricula(
  codigoMatricula: number,
) {
  const response = await axiosNestGa.get<CursoEspecialidade[]>(
    `/cursos/especialidades/${codigoMatricula}`,
  );
  return response.data;
}
export async function getCursoBasePorCodigoMatricula(codigoMatricula: number) {
  const response = await axiosNestGa.get<CursoBase | null>(
    `/cursos/base/${codigoMatricula}`,
  );
  return response.data;
}
