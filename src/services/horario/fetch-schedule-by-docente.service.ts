// src/services/schedule/getSchedulesByDocenteService.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetSchedulesByDocentePayload = {
  docenteId: number;        // ex: 2273
  anoLectivo: number;       // ex: 22
  semestre: number;         // ex: 1
  periodo: number;          // ex: 5
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ---------- */
export type AulaDocente = {
  codigo: number;
  horario_nome: string;           // "ACSP.1.PS.D-H1"
  docente_nome: string;           // "JOAQUIM DE CARVALHO"
  codigo_docente: string;
  hora_inicio: string;            // .NET ticks
  hora_termino: string;
  codigo_grade: number;
  disciplina: string;             // "Psicologia da Saúde"
  modalidade: string;             // "Presencial"
  tipo_aula: string;              // "Teorica"
  dia_semana: string;             // "Terça-Feira"
  ordem_dia_semana: number;
  sala: string;                   // "U-607"
  codigo_curso: number;
  curso: string;                  // "ACSP"
  ano: string;                    // "1º ano"
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

export type GetSchedulesByDocenteResponse = {
  data: AulaDocente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function getSchedulesByDocenteService(
  payload: GetSchedulesByDocentePayload
): Promise<GetSchedulesByDocenteResponse> {
  const {
    docenteId,
    anoLectivo,
    semestre,
    periodo,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetSchedulesByDocenteResponse>(
    "/schedule/by-docente",
    {
      params: {
        docenteId,
        anoLectivo,
        semestre,
        periodo,
        page,
        limit,
      },
    }
  );

  return data;
}