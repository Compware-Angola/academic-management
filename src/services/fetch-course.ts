import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface Curso {
  codigo: number;
  designacao: string;
  duracao: number;
}

export interface CursoParams {
  faculdadeId?: number;
}

export interface CursoResponse {
  cursos: Curso[];
}

export async function getCursosDropdown(
  params?: CursoParams,
): Promise<Curso[]> {
  const response = await axiosApexGa.get<CursoResponse>("/uma/course/all", {
    params: {
      faculdadeId: params?.faculdadeId,
    },
  });
  return response.data.cursos ?? [];
}
