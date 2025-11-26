
import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface Curso {
  codigo: number;
  designacao: string;    
  duracao: number;       
}

export interface CursoResponse {
  cursos: Curso[];
}

export async function getCursosDropdown(): Promise<Curso[]> {
  const response = await axiosApexGa.get<CursoResponse>("/uma/course/all");
  return response.data.cursos;
}