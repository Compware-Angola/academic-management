import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface FiltroAgendamentoAulaPayload {
  unidadeCurricular?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
}
   
export interface AgendamentoAulaItem {
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
  sumario_data_criacao: string | null;
  sumario_data_atualizacao: string | null;
  docente: string | null;
}

export interface AgendamentoAulaResponse {
  data: AgendamentoAulaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchAgendamentoAula(
  payload: FiltroAgendamentoAulaPayload,
): Promise<AgendamentoAulaResponse> {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = payload;

  const { data } =
    await axiosNestGa.get<AgendamentoAulaResponse>(
      "sumario/aulas-agendadas",
      {
        params: {
          unidadeCurricular,
          docente,
          dataInicial,
          dataFinal,
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
