import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetAssessmentStatsPayload = {
  anoLectivo: number; // ex: 22
  tipoProva: number; // ex: 1
  tipoAvaliacao: number[]; // ex: 2
  horarioId: number; // ex: 10
  gradeId: number; // ex: 5
};

/* ---------- RESPONSE ---------- */
export type AssessmentStatsItem = {
  curso: string;
  disciplina: string;
  avaliacao: string;
  nomehorario: string;
  tipoavaliacao: number;
  qtdinscrito: number;
  qtdavaliados: number;
  qtdaprovados: number;
  qtdreprovados: number;
  taxaavaliacao_sobreinscritos: number;
  taxaaprovacao_sobreinscritos: number;
  taxareprovacao_sobreinscritos: number;
  taxaaprovacao_sobreavaliados: number;
  taxareprovacao_sobreavaliados: number;
};

export type GetAssessmentStatsResponse = {
  data: AssessmentStatsItem[];
};

/* ---------- SERVICE ---------- */
export async function getAssessmentStatsService(
  payload: GetAssessmentStatsPayload
): Promise<GetAssessmentStatsResponse> {
  const { anoLectivo, tipoProva, tipoAvaliacao, horarioId, gradeId } = payload;

  const { data } = await axiosNestGa.post<GetAssessmentStatsResponse>(
    "/assessment/estatistica-avaliacao",
    {
      anoLectivo,
      tipoProva,
      tipoAvaliacao,
      horarioId,
      gradeId,
    }
  );

  return data;
}
