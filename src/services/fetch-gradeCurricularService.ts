// src/services/gradeCurricularService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";

// ======================== TIPOS ========================
export interface GradeCurricular {
  codigo: number;
  codigo_disciplina: number;
  descricao_disciplina: string;
  descricao_curso: string;
  codigo_curso: number;
  codigo_semestre: number;
  descricao_classe: string;
  designacao_semestre: string;
  codigo_ano_lectivo?: number;
  codigo_classe?: number;
}

export interface GradeCurricularResponse {
  grade_curriculares: GradeCurricular[];
}

// Payload para adicionar UC ao plano
export interface AddUCToPlanPayload {
  codigo_disciplina: number;
  codigo_ano_lectivo: number;
  codigo_semestre: number;
  codigo_classe: number;
  codigo_curso: number;
  codigo_utilizador: number;
}

export interface AddUCToPlanResponse {
  message?: string;
  success?: boolean;
  // Adiciona aqui outros campos que a API devolva, se necessário
}

// ======================== SERVIÇOS ========================

/**
 * Busca todas as UCs do plano de estudos
 */
export async function getGradeCurricular(
  codigo_ano_lectivo: number,
  codigoCurso: number,
  codigoclasse: number
): Promise<GradeCurricular[]> {
  const response = await axiosApexGa.get<GradeCurricularResponse>(
    `/ga/curricular-unit/${codigo_ano_lectivo}/${codigoCurso}/${codigoclasse}`
  );
  return response.data.grade_curriculares || [];
}

/**
 * Adiciona uma UC ao plano de estudos
 * POST http://34.202.163.85:8080/ords/cmpdev/ga/curriculum-unit
 */
export async function addUCToPlan(
  payload: AddUCToPlanPayload
): Promise<AddUCToPlanResponse> {
  const response = await axiosApexGa.post<AddUCToPlanResponse>(
    `/ga/curriculum-unit`, // a tua rota exata
    payload
  );
  return response.data;
}

