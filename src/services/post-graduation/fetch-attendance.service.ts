import { axiosNestGa } from "@/lib/axios-nest-ga";
import { CalendarMode, GeneralAttendanceResponse } from "@/util/types";

export type FetchPostGraduationAttendanceScheduleParams = {
  degreeId?: number;
  unidadeCurricular?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  periodoId?: number;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
};

export type PostGraduationAttendanceScheduleItem = {
  codigo: number;
  curso: string;
  unidade_curricular: string;
  tipo_aula: string;
  ordem_tempo: number;
  hora_inicio: string;
  hora_fim: string;
  data_aula: string;
  estado_agendamento_aula: number;
  estado_agendamento_aula_designacao: string;
  dia_semana: string;
  docente: string;
};

export type FetchPostGraduationAttendanceScheduleResponse = {
  data: PostGraduationAttendanceScheduleItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchPostGraduationAttendanceTestParams = {
  degreeId?: number;
  docente?: number;
  disciplina?: number;
  dataInicio?: string;
  dataFim?: string;
  periodoId?: number;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
};

export type PostGraduationAttendanceTestItem = {
  codigo: number;
  data_prova: string;
  disciplina: string | null;
  estado: string | null;
  estado_agendamentoid: number | null;
  ano_lectivo: string;
  ano_lectivo_designacao: string;
  semestre: string;
  hora_prova: string | null;
  hora_termino: string | null;
  duracao_prova: string | null;
  docente_nome: string | null;
};

export type FetchPostGraduationAttendanceTestResponse = {
  data: PostGraduationAttendanceTestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchPostGraduationAttendanceControlParams = {
  degreeId?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  curso?: number;
  gradeCurricular?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type PostGraduationAttendanceControlItem = {
  codigo: number;
  curso: string;
  unidade_curricular: string;
  ordem_tempo: number;
  hora_inicio: string;
  hora_fim: string;
  data_aula: string;
  estado_agendamento: number;
  estado_agendamento_designacao: string;
  docente: string;
};

export type PostGraduationAttendanceControlSummary = {
  marcacoesPendentes: number;
  presencasMarcadas: number;
  faltasMarcadas: number;
};

export type FetchPostGraduationAttendanceControlResponse = {
  data: PostGraduationAttendanceControlItem[];
  resumo?: PostGraduationAttendanceControlSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PostGraduationAttendanceStatus = {
  codigo: number;
  designacao: string;
};

export type FetchPostGraduationAttendanceTeachersParams = {
  degreeId?: number;
  anoLectivo?: number;
  semestre?: number;
  search?: string;
};

export type FetchPostGraduationTeacherGeneralCalendarParams = {
  degreeId?: number;
  modo: CalendarMode;
  dataReferencia?: string;
  docenteId?: number;
  docenteNome?: string;
};

export type PostGraduationAttendanceTeacher = {
  codigo: number;
  codigo_utilizador: number;
  email: string;
  username: string;
  nome: string;
  n_mecanografico: string;
  codigo_escalao: number | null;
  codigo_categoria: number | null;
  descricao_categoria: string;
  descricao_escalao: string;
  descricao_grau_academico: string;
};

export async function fetchPostGraduationAttendanceSchedules(
  params: FetchPostGraduationAttendanceScheduleParams,
): Promise<FetchPostGraduationAttendanceScheduleResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationAttendanceScheduleResponse>(
      "/post-graduation/attendance/filtro",
      { params },
    );

  return data;
}

export async function fetchPostGraduationAttendanceFieldSchedules(
  params: FetchPostGraduationAttendanceScheduleParams,
): Promise<FetchPostGraduationAttendanceScheduleResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationAttendanceScheduleResponse>(
      "/post-graduation/attendance/campo",
      { params },
    );

  return data;
}

export async function fetchPostGraduationAttendanceTests(
  params: FetchPostGraduationAttendanceTestParams,
): Promise<FetchPostGraduationAttendanceTestResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationAttendanceTestResponse>(
      "/post-graduation/attendance/prova",
      { params },
    );

  return data;
}

export async function fetchPostGraduationAttendanceControl(
  params: FetchPostGraduationAttendanceControlParams,
): Promise<FetchPostGraduationAttendanceControlResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationAttendanceControlResponse>(
      "/post-graduation/attendance/controle",
      { params },
    );

  return data;
}

export async function fetchPostGraduationAttendanceTeachers(
  params: FetchPostGraduationAttendanceTeachersParams,
): Promise<PostGraduationAttendanceTeacher[]> {
  const { data } = await axiosNestGa.get<PostGraduationAttendanceTeacher[]>(
    "/post-graduation/attendance/teachers",
    { params },
  );

  return data;
}

export async function fetchPostGraduationTeacherGeneralCalendar(
  params: FetchPostGraduationTeacherGeneralCalendarParams,
): Promise<GeneralAttendanceResponse> {
  const { data } = await axiosNestGa.get<GeneralAttendanceResponse>(
    "/post-graduation/attendance/controle-geral-docente",
    { params },
  );

  return data;
}

export async function fetchPostGraduationAttendanceStatus(): Promise<
  PostGraduationAttendanceStatus[]
> {
  const { data } = await axiosNestGa.get<PostGraduationAttendanceStatus[]>(
    "/post-graduation/attendance/status-agendamento",
  );

  return data;
}
