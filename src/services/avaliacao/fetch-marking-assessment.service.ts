import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetMarkingAssessmentPayload = {
  anoLectivo: number; // ex: 2024
  semestre?: number; // ex: 1
  periodo?: number; // ex: 5
  curso?: number; // ex: 18
  anoCurricular?: number; // ex: 1
  tipoAvaliacao?: number; // ex: "Normal"
  tipoHorario?: number; // ex: "Diurno"
  horarioId?: number;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ---------- */
export type MarkingAssessmentItem = {
  disciplina: string;
  horario: string;
  codigo_horario: number;
  duracaoprova: string;
  vigilante: string | null;
  curso: string;
  classe: string;
  anolectivo: string;
  faculdade: string;
  periodo: string;
  horatermino: string;
  codigoprova: number;
  tcp_data_prova: string;
  tb_salas_designacao: string;
  tcp_hora_prova: string;
  vigilantes: string | null;
  epoca: string;
};

export type GetMarkingAssessmentResponse = {
  data: MarkingAssessmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function getMarkingAssessmentService(
  payload: GetMarkingAssessmentPayload
): Promise<GetMarkingAssessmentResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    tipoAvaliacao,
    horarioId,
    tipoHorario,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetMarkingAssessmentResponse>(
    "/assessment/marcacoes-provas",
    {
      params: {
        anoLectivo,
        semestre,
        periodo,
        curso,
        anoCurricular,
        tipoAvaliacao,
        tipoHorario,
        horarioId,
        page,
        limit,
      },
    }
  );

  return data;
}
