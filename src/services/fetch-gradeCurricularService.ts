// src/services/gradeCurricularService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface GradeCurricular {
  codigo: number;
  codigo_disciplina: number;
  descricao_disciplina: string;
  descricao_curso: string;
  codigo_curso: number;
  codigo_semestre: number;
  descricao_classe:string;
  designacao_semestre: string;
}

export interface GradeCurricularResponse {
  grade_curriculares: GradeCurricular[];
}

export async function getGradeCurricular(
  codigo_ano_lectivo: number,
  codigoCurso: number,
  codigoclasse: number
): Promise<GradeCurricular[]> {
  const response = await axiosApexGa.get<GradeCurricularResponse>(
    `/ga/curricular-unit/${codigo_ano_lectivo}/${codigoCurso}/${codigoclasse}`
  );
  return response.data.grade_curriculares;
}