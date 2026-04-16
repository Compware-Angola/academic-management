import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface FiltroAssiduidadePayload {
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
}

export interface FiltroAssiduidadeItem {
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
}

export interface FiltroAssiduidadeResponse {
  data: FiltroAssiduidadeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function filtroAssiduidadeService(
  payload: FiltroAssiduidadePayload,
): Promise<FiltroAssiduidadeResponse> {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado,
    periodoId,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = payload;

  const { data } =
    await axiosNestGa.get<FiltroAssiduidadeResponse>(
      "assiduidade/filtro",
      {
        params: {
          unidadeCurricular,
          docente,
          dataInicial,
          dataFinal,
          periodoId,
          estado,
          anoLectivo,
          semestre,
          page,
          limit,
        },
      },
    );

  return data;
}
export async function filtroAssiduidadeCampoService(
  payload: FiltroAssiduidadePayload,
): Promise<FiltroAssiduidadeResponse> {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    
    estado,
    periodoId,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = payload;

  const { data } =
    await axiosNestGa.get<FiltroAssiduidadeResponse>(
      "assiduidade/campo",
      {
        params: {
          unidadeCurricular,
          docente,
          dataInicial,
          dataFinal,
          periodoId,
          estado,
          anoLectivo,
          semestre,
          page,
          limit,
        },
      },
    );

  return data;
}


export interface ProvaAssiduidadePayload {
  docente?: number;
  disciplina?: number;
  dataInicio?: string;
  periodoId?: number;
  dataFim?: string;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
}

export interface ProvaAssiduidadeItem {
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
}

export interface ProvaAssiduidadeResponse {
  data: ProvaAssiduidadeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function provaAssiduidadeService(
  payload: ProvaAssiduidadePayload,
): Promise<ProvaAssiduidadeResponse> {
  const {
    docente,
    disciplina,
    dataInicio,
    periodoId,
    dataFim,
    estado,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = payload;

  const { data } =
    await axiosNestGa.get<ProvaAssiduidadeResponse>(
      "assiduidade/prova",
      {
        params: {
          docente,
          disciplina,
          dataInicio,
          periodoId,
          dataFim,
          estado,
          anoLectivo,
          semestre,
          page,
          limit,
        },
      },
    );

  return data;
}
export async function  statusAgendamentoService(): Promise<{ codigo: number; designacao: string }[]> {
  const { data } =
    await axiosNestGa.get<{ codigo: number; designacao: string }[]>(
      "assiduidade/status-agendamento",
    );

  return data;
}