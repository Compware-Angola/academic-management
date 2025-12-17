import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetSchedulesByClassRoomPayload = {
  anoLectivo: number;
  semestre: number;
  periodo: number;
  curso: number;
  sala: number;
  page?: number;
  limit?: number;
  anoCurricular: number;
  unidadeCurricular: number;
};

export type ClassRoomScheduleItem = {
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
  salaid: string;
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
  atualizadopor: string;
  dataultimaatualizacao: string;
  datacriacao: string;
};

export type GetSchedulesByClassRoomResponse = {
  data: ClassRoomScheduleItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getSchedulesByClassRoomService(
  payload: GetSchedulesByClassRoomPayload
): Promise<GetSchedulesByClassRoomResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    unidadeCurricular,
    anoCurricular,
    sala,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetSchedulesByClassRoomResponse>(
    "/schedule/by-class-room",
    {
      params: {
        anoLectivo,
        semestre,
        periodo,
        anoCurricular,
        curso,
        sala,
        page,
        limit,
        unidadeCurricular,
      },
    }
  );

  return data;
}
