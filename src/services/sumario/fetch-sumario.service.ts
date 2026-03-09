import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface FiltroSumarioPayload {
  unidadeCurricular?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  estado_sumario?: number;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
}

export interface SumarioItem {
  sumario_codigo: number;
  sumario_descricao: string;
  sumario_estado: number;
  sumario_estado_designacao: string;
  sumario_data_criacao: string;
  sumario_data_atualizacao: string;

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
  docente: string;
}
export interface SumarioResponse {
  data: SumarioItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchSumario(
  payload: FiltroSumarioPayload,
): Promise<SumarioResponse> {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado_sumario,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = payload;

  const { data } =
    await axiosNestGa.get<SumarioResponse>(
      "sumario",
      {
        params: {
          unidadeCurricular,
          docente,
          dataInicial,
          dataFinal,
          estado_sumario,
          anoLectivo,
          semestre,
          page,
          limit,
        },
      },
    );

  return data;
}
