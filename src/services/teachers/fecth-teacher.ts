import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Teacher = {
 codigo: number,
username: string,
nome: string,
n_mecanografico: string,
codigo_escalao: number,
codigo_categoria: number,
descricao_grau_academico: string,
descricao_escalao: string,
descricao_categoria: string
 }
export async function fetchTeacher(): Promise<Teacher[]> {
  const { data } = await axiosApexGa.get("/ga/teacher/list-teachers");
  return data.docentes ?? [];
}
