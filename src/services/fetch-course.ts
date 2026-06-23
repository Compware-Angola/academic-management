import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface Curso {
  codigo: number;
  designacao: string;
  duracao: number;
}

export interface CursoParams {
  search?: string;
  faculdadeId?: number;
  tipoCandidaturaId?: number;
  level?:"GRADUATION"|"POST_GRADUATION"
}

export interface CursoResponse {
  data: Curso[];
}

export async function getCursosDropdown(
  params?: CursoParams,
): Promise<Curso[]> {
  const response = await axiosNestGa.get<CursoResponse>("/cursos", {
    params: {
      faculdadeId: params?.faculdadeId,
      tipoCandidaturaId: params?.tipoCandidaturaId,
      level: params?.level,
      limit:100
    },
  });
  return response.data.data ?? [];
}
