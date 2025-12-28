import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetAssessmentNotasPayload = {
  anoLectivo: number;
  tipoProva?: number;
  tipoAvaliacao?: number;
  horarioOrTurmaId?: number;
  gradeId: number;
  tipoConsulta: number;
  page?: number;
  limit?: number;
};

export type NotaItem = {
  codigo_grade: number;
  numero_matricula: number;
  nome_completo: string;
  avaliacao: number;
  status: number;
  observacao: string | null;
  nota: number | null;
  data_lancamento: string; // ISO Date
  data_atualizacao: string; // ISO Date
  hora: string; // "08"
  minuto: string; // "59"
  hora_criacao: string; // "08"
  minuto_criacao: string; // "59"
  nome_docente: string;
  descricao_avaliacao: string;
};
export type GetAssessmentNotasResponse = {
  data: NotaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getAssessmentNotasService(
  payload: GetAssessmentNotasPayload
): Promise<GetAssessmentNotasResponse> {
  const {
    anoLectivo,
    tipoProva,
    tipoAvaliacao,
    horarioOrTurmaId,
    gradeId,
    tipoConsulta,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetAssessmentNotasResponse>(
    "/assessment/visualizar-notas",
    {
      params: {
        anoLectivo,
        tipoProva,
        tipoAvaliacao,
        horarioOrTurmaId,
        gradeId,
        tipoConsulta,
        page,
        limit,
      },
    }
  );

  return data;
}
