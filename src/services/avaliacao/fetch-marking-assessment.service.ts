import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetMarkingAssessmentPayload = {
  anoLectivo: number; // ex: 2024
  semestre?: number; // ex: 1
  periodo?: number; // ex: 5
  curso?: number; // ex: 18
  anoCurricular?: number; // ex: 1
  prazoId?: number; // ex: "Normal"
  tipoHorario?: number; // ex: "Diurno"
  horarioId?: number;
  page?: number;
  limit?: number;
  unidadeCurricular?: number;
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
  payload: GetMarkingAssessmentPayload,
): Promise<GetMarkingAssessmentResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    prazoId,
    horarioId,
    tipoHorario,
    page = 1,
    limit = 25,
    unidadeCurricular,
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
        prazoId,
        tipoHorario,
        horarioId,
        page,
        limit,
        unidadeCurricular,
      },
    },
  );

  return data;
}

//================================================================== BY ID =======================================================================
export interface Vigilante {
  codigo_utilizador: number;
  nome_vigilante: string;
  codigo_docente: number;
}

export interface MarcacaoProva {
  codigo_prazo: string;
  codigo_horario: number;
  horario: string;
  codigo_ano_lectivo: string;
  codigo_semestre: string;
  codigo_periodo: string;
  codigo_curso: number;
  codigo_classe: number;
  codigo_grade: number;
  codigo_prova: number;
  codigo_tipo_prova: number;
  codigo_sala: number;
  hora_termino: string;
  hora_prova: string;
  data_prova: string;
  codigo_modalidade: number;
  tipo_candidatura: number;
  vigilantes: Vigilante[];
}

export async function getMarcacaoProvaByIdService(
  id: number,
): Promise<MarcacaoProva> {
  const { data } = await axiosNestGa.get<MarcacaoProva>(
    `/assessment/marcacoes-provas/${id}`,
  );

  return data;
}
