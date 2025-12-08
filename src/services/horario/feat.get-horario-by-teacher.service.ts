import { axiosApexGa } from "@/lib/axios-apex-ga";

/* ---------- PAYLOAD ---------- */
export type ListSchedulesPayload = {
  teacherId: number;        // 1191 no exemplo
  anoLectivo: number;     // 23 no exemplo
  semestre?: number;       // ?semestre=1
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


  const { data } = await axiosApexGa.get<ListSchedulesResponse>(
    `/ga/tearcher/list-schedules/${teacherId}/${anoLectivo}`,
    {
      params: {
        semestre,
      },
    }
  );

  return data;
}