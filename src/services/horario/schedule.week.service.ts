import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetSchedulesByDayOfWeekPayload = {
  anoLectivo: number;          // ex: 22
  semestre: number;            // ex: 1
  anoCurricular: number;       // ex: 2
  diaSemana: number;           // ex: 3 (terça-feira)
  periodo: number;             // ex: 6
  curso: number;               // ex: 15
  unidadeCurricular: number;   // ex: 789
  page?: number;
  limit?: number;
};

/* ---------- ITEM ---------- */
export type ScheduleByDayItem = {
  codigo: number;
  horario_nome: string;
  docente_nome: string;
  codigo_docente: string;
  hora_inicio: string;
  hora_termino: string;
  codigo_grade: number;
  disciplina: string;
  modalidade: string;
  tipo_aula: string;
  dia_semana: string;
  ordem_dia_semana: number;
  sala: string;
  codigo_curso: number;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  periodo: string;
  estado: string;
  estadocor: string | null;
  estadoid: number;
  disponibilidade: string;
  criadopor: string;
  atualizadopor: string | null;
  dataultimaatualizacao: string;
  datacriacao: string;
};

/* ---------- RESPONSE ---------- */
export type GetSchedulesByDayOfWeekResponse = {
  data: ScheduleByDayItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function getSchedulesByDayOfWeekService(
  payload: GetSchedulesByDayOfWeekPayload
): Promise<GetSchedulesByDayOfWeekResponse> {
  const {
    anoLectivo,
    semestre,
    anoCurricular,
    diaSemana,
    periodo,
    curso,
    unidadeCurricular,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetSchedulesByDayOfWeekResponse>(
    "/schedule/by-day-of-week",
    {
      params: {
        anoLectivo,
        semestre,
        anoCurricular,
        diaSemana,
        periodo,
        curso,
        unidadeCurricular,
        page,
        limit,
      },
    }
  );

  return data;
}
