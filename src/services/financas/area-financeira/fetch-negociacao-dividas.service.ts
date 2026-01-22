import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ObterNegociacoesPayload = {
  codigoAnoLectivo?: number;
  codigoCurso?: number;
  tipoNegociacaoId?: number;
  faculdadeId?: number;
  nome?: string;
  codigoMatricula?: number;
  page?: number;
  limit?: number;
};

export interface Estatisticas {
  totalDividas: number;
  totalPrimeiroValorApagar: number;
  totalRestante: number;
}
export type NegociacaoItem = {
  codigo_matricula: number;
  codigo_factura: number;
  nome: string;
  curso: string;
  valor_divida: number;
  prestacoes: number;
  mes_inicial: string;
  mes_final: string;
  primeiro_valor_pagar: number;
  valor_prestacao: number;
  valor_restante: number;
  ano_lectivo: number;
  tipo_negociacao_id: number;
  faculdade_id: number;
  faculdade: number;
  rn: number;
};

export type ObterNegociacoesResponse = {
  data: NegociacaoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: Estatisticas;
};

export async function getNegociacoesService(
  payload: ObterNegociacoesPayload,
): Promise<ObterNegociacoesResponse> {
  const {
    codigoAnoLectivo,
    codigoCurso,
    tipoNegociacaoId,
    faculdadeId,
    codigoMatricula,
    nome,
    page = 1,
    limit = 10,
  } = payload;

  const { data } = await axiosNestFinance.get<ObterNegociacoesResponse>(
    "debt-negotiation/list",
    {
      params: {
        codigoAnoLectivo,
        codigoCurso,
        tipoNegociacaoId,
        faculdadeId,
        codigoMatricula,
        nome,
        page,
        limit,
      },
    },
  );

  return data;
}
