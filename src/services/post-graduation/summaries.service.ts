import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface PostGraduationSummaryScheduledClassesParams {
  unidadeCurricular?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  degreeId?: number;
  page?: number;
  limit?: number;
}

export interface PostGraduationSummaryItem {
  codigo: number;
  curso: string;
  unidade_curricular: string;
  tipo_aula: string;
  ordem_tempo: number;
  data_aula: string;
  hora_inicio: string;
  hora_fim: string;
  estado_agendamento_aula: number;
  estado_agendamento_aula_designacao: string;
  horario: string;
  sala: string;
  classe: string;
  modalidade: string;
  dia_semana: string;
  sumario_codigo: number | null;
  sumario_descricao: string | null;
  sumario_estado?: number | null;
  sumario_estado_designacao?: string | null;
  sumario_data_criacao: string | null;
  sumario_data_atualizacao: string | null;
  docente: string | null;
}

export interface PostGraduationSummaryScheduledClassesResponse {
  data: PostGraduationSummaryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostGraduationSummariesParams {
  unidadeCurricular?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  estado_sumario?: number;
  anoLectivo?: number;
  semestre?: number;
  degreeId?: number;
  page?: number;
  limit?: number;
}

export type PostGraduationSummariesResponse =
  PostGraduationSummaryScheduledClassesResponse;

export interface PostGraduationSummaryGeneralControlItem {
  codigo_agendamento: number;
  docente: string;
  unidadeCurricular: string;
  horario: string;
  curso: string;
  controleSumarios: {
    pendentes: number;
    lancados: number;
    total: number;
  };
  controleAssiduidade: {
    pendentes: number;
    presenca: number;
    falta: number;
    total: number;
  };
  sumarioComAssiduidade: number;
}

export interface PostGraduationSummaryGeneralControlResponse {
  data: PostGraduationSummaryGeneralControlItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePostGraduationSummaryPayload {
  fk_agendamento_aula: number;
  fk_estado_sumario: number;
  descricao: string;
  active_state?: number;
}

export interface UpdatePostGraduationSummaryPayload
  extends CreatePostGraduationSummaryPayload {
  justificacao_director?: string;
}

export interface PostGraduationSummaryMutationResponse {
  message: string;
  success?: boolean;
}

export async function fetchPostGraduationSummaryScheduledClasses(
  params: PostGraduationSummaryScheduledClassesParams,
): Promise<PostGraduationSummaryScheduledClassesResponse> {
  const { data } =
    await axiosNestGa.get<PostGraduationSummaryScheduledClassesResponse>(
      "/post-graduation/summaries/scheduled-classes",
      { params },
    );

  return data;
}

export async function fetchPostGraduationSummaries(
  params: PostGraduationSummariesParams,
): Promise<PostGraduationSummariesResponse> {
  const { data } = await axiosNestGa.get<PostGraduationSummariesResponse>(
    "/post-graduation/summaries",
    { params },
  );

  return data;
}

export async function fetchPostGraduationSummaryGeneralControl(
  params: PostGraduationSummaryScheduledClassesParams,
): Promise<PostGraduationSummaryGeneralControlResponse> {
  const { data } =
    await axiosNestGa.get<PostGraduationSummaryGeneralControlResponse>(
      "/post-graduation/summaries/general-control",
      { params },
    );

  return data;
}

export async function createPostGraduationSummary(
  payload: CreatePostGraduationSummaryPayload,
): Promise<PostGraduationSummaryMutationResponse> {
  const { data } = await axiosNestGa.post<PostGraduationSummaryMutationResponse>(
    "/post-graduation/summaries",
    payload,
  );

  return data;
}

export async function updatePostGraduationSummary(
  summaryId: number,
  payload: UpdatePostGraduationSummaryPayload,
): Promise<PostGraduationSummaryMutationResponse> {
  const { data } = await axiosNestGa.put<PostGraduationSummaryMutationResponse>(
    `/post-graduation/summaries/${summaryId}`,
    payload,
  );

  return data;
}

export async function validatePostGraduationSummary(
  summaryId: number,
  statusId: number,
): Promise<void> {
  await axiosNestGa.patch(
    `/post-graduation/summaries/${summaryId}/validate/${statusId}`,
    {},
  );
}
