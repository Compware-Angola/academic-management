import { axiosNestGa } from "@/lib/axios-nest-ga";

/** =========================
 *  MODELOS
 *  ========================= */

export type PautaGeral = {
  obs: string[];
  formula: string[];
  nota1f: string;
  nota2f: string;
  notaEx: string;
  notaRec: string;
  notaPra: string;
  notaOr: string;
  notaOrRec: string;
  notaMel: string;
  notaEE: string;
  notaOEE: string;
  ano: string;
  codigoGradeAluno: number;
  disciplina: string;
  duracao: string;
  gradeCurricula: number;
  matricula: number;
  media: string;
  nome_completo: string;
  num_matricula: string;
  resultado: string;
  semestre: string;
  unidadeCurricular: string;
};

/** =========================
 *  RESPOSTA PAGINADA GENÉRICA
 *  ========================= */
export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** =========================
 *  PARAMS
 *  ========================= */
export type PautasGeralParams = {
  anoLectivo: string;
  semestre: string;

  gradeCurricular?: string;
  horario?: string;
  gradeCurricularTurma?: string;
  turma?: string;

  page?: number;
  limit?: number;
};

/** =========================
 *  RESPONSE
 *  ========================= */
export type PautasGeralResponse = PaginatedResponse<PautaGeral>;

/** =========================
 *  REQUEST
 *  ========================= */
export async function getPautasGeral(
  params: PautasGeralParams
): Promise<PautasGeralResponse> {
  const response = await axiosNestGa.get<PautasGeralResponse>(
    "/assessment/pautas-geral",
    { params }
  );

  return response.data;
}
