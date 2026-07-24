import { axiosNestGa } from "@/lib/axios-nest-ga";
export type Teacher = {
  codigo: number;
  codigo_utilizador: number;
  username: string;
  nome: string;
  n_mecanografico: string;
  codigo_escalao: number;
  codigo_categoria: number;
  descricaograuacademico: string;
  descricao_escalao: string;
  descricao_categoria: string;
};
export interface TeacherParams {
  tipoCandidatura?: number;
  nome?: string;
}
export async function fetchTeacher(params?: TeacherParams): Promise<Teacher[]> {
  const { data: response } = await axiosNestGa.get(
    "/dropdown-filters/docentes",
    {
      params,
    },
  );
  return response.data ?? [];
}
