import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Teacher = {
  codigo: number;
  codigo_utilizador: number;
  username: string;
  nome: string;
  n_mecanografico: string;
  codigo_escalao: number;
  codigo_categoria: number;
  descricao_grau_academico: string;
  descricao_escalao: string;
  descricao_categoria: string;
};
export interface TeacherParams {
  tipoCandidatura?: number;
  nome?: string;
}
export async function fetchTeacher(params?: TeacherParams): Promise<Teacher[]> {
  const { data: response } = await axiosApexGa.get(
    "/dropdown-filters/docentes",
    {
      params,
    },
  );
  return response.data ?? [];
}
