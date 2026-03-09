import { axiosNestGa } from "@/lib/axios-nest-ga";

export type TeacherClassCalendarItem = {
  codigo: number;
  data_aula: string;
  hora_inicio: string;
  hora_fim: string;
  estado: number;
  estado_designacao: string;
  disciplina: string;
  docente: string;
  sala: string | null;
  tipo_aula: string | null;
  modalidade: string | null;
  cor: string;
  start: string;
  end: string;
  title: string;
};

export type TeacherClassCalendarResponse = {
  data: TeacherClassCalendarItem[];
  resumo: {
    totalEventos: number;
    pendentes: number;
    faltas: number;
    presencas: number;
  };
};


export type FetchTeacherClassCalendarParams = {
  docente: number;
  dataInicial?: string;
  dataFinal?: string;
};

export async function fetchTeacherClassCalendar(
  params: FetchTeacherClassCalendarParams
): Promise<TeacherClassCalendarResponse> {
  const { data } = await axiosNestGa.get("/assiduidade/calendario-docente", {
    params,
  });

  return data;
}