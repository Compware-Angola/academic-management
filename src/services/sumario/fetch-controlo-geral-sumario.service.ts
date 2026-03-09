import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface FiltroControleGeralPayload {
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

export interface ControloItem {
  codigo_agendamento:number;
  docente: string;
  unidadeCurricular: string;
  horario: string;
  curso: string;
  controleSumarios: {
    pendentes: number;
    lancados: number;
    total: number
  }
  controleAssiduidade: {
    pendentes: number;
    presenca: number;
    falta: number;
    total: number
  }
  sumarioComAssiduidade: number
}

export interface ControleResponse {
  data: ControloItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchControloGeralAssiduidade(
  payload: FiltroControleGeralPayload,
): Promise<ControleResponse> {
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
    await axiosNestGa.get<ControleResponse>(
      "sumario/controle-geral-assiduidade",
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
