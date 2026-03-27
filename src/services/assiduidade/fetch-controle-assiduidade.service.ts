// src/services/assiduidade/getAttendanceControllingService
import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetAttendanceControllingPayload = {
  docenteId: number;        // ex: 2273
  anoLectivo: number;
  estado_aula: number;       // ex: 22
  semestre: number;         // ex: 1
  data_inicio: Date;
  data_fim: Date;          // ex: 5
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ---------- */
export type AttendanceControle = {
  codigo: number;
  horario_nome: string;           // "ACSP.1.PS.D-H1"
  docente_nome: string;           // "JOAQUIM DE CARVALHO"
  hora_inicio: string;            // .NET ticks
  hora_termino: string;
  disciplina: string;             // "Psicologia da Saúde"
  data_aula: Date;
  curso: string;
};

export type GetAttendanceControleResponse = {
  data: AttendanceControle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function getAttendanceControllingService(
  payload: GetAttendanceControllingPayload
): Promise<GetAttendanceControleResponse> {
  const {
    docenteId,
    anoLectivo,
    semestre,
    estado_aula,
    data_inicio,
    data_fim,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetAttendanceControleResponse>(
    "/assiduidade/controle",
    {
      params: {
        docenteId,
        anoLectivo,
        semestre,
        data_inicio,
        data_fim,
        estado_aula,
        page,
        limit,
      },
    }
  );

  return data;
}