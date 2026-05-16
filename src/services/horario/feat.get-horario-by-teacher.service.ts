import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type ListSchedulesPayload = {
  teacherId: number;        // 1191 no exemplo
  anoLectivo: number;     // 23 no exemplo
  semestre?: number;       // ?semestre=1
};

type ScheduleByDocenteItem = {
  codigo: number;
  horario_nome: string;
  docente_nome: string;
  codigo_grade: number;
  disciplina: string;
  sala: string;
  curso: string;
  ano: string;
};

type ScheduleByDocenteResponse = {
  data: ScheduleByDocenteItem[];
};

/* ---------- RESPONSE ---------- */
export type ScheduleItem = {
  codigo_horario: number;
  horario: string;
  codigo_sala: string;
  sala: string;
  docente: string;
  codigo_grade: string;
  grade: string;
};

export type ListSchedulesResponse = {
  horarios: ScheduleItem[];
};

/* ---------- SERVICE ---------- */
export async function listSchedulesService(
  payload: ListSchedulesPayload
): Promise<ListSchedulesResponse> {
  const { teacherId, anoLectivo, semestre } = payload;

  const { data } = await axiosNestGa.get<ScheduleByDocenteResponse>(
    "/schedule/by-docente",
    {
      params: {
        docenteId: teacherId,
        anoLectivo,
        semestre,
        limit: 100,
      },
    }
  );

  return {
    horarios: (data.data ?? []).map((item) => ({
      codigo_horario: item.codigo,
      horario: item.horario_nome,
      codigo_sala: item.sala,
      sala: item.sala,
      docente: item.docente_nome,
      codigo_grade: String(item.codigo_grade),
      grade: [item.disciplina, item.curso, item.ano].filter(Boolean).join(" • "),
    })),
  };
}
