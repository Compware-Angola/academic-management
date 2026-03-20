import { axiosNestFinance } from "@/lib/axios-nest-finance.ts";

export type IsencaoServico = {
  codigo: number;
  codigo_matricula: number;
  nome_completo: string;
  bilhete_identidade: string;
  curso: string;
  grau_academico: string;
  codigo_servico: number;
  servico: string;
  codigo_preinscricao: number;
  data_isencao: string;
  codigo_anolectivo: string;
  ano_lectivo: string;
  estado_isensao: string;
};

export type PaginationResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchIsencaoServicoPayloadPaginated = {
  codigoMatricula?: number;
  codigoServico?: number;
  estadoIsencao?: string;
  codigoCurso?: number;
  faculdadeId?: number;
  anoLectivo?: number;
  page?: number;
  limit?: number;
};

export async function fetchIsencaoServicoAll(
  payload: FetchIsencaoServicoPayloadPaginated,
): Promise<PaginationResponse<IsencaoServico>> {
  const {
    anoLectivo,
    codigoCurso,
    codigoMatricula,
    codigoServico,
    estadoIsencao,
    faculdadeId,
    limit,
    page,
  } = payload;
  const { data } = await axiosNestFinance.get("/isencao", {
    params: {
      codigoMatricula: codigoMatricula,
      codigoServico: codigoServico,
      estadoIsencao: estadoIsencao,
      anoLectivo,
      codigoCurso,
      faculdadeId,
      page: page ?? 1,
      limit: limit ?? 10,
    },
  });

  return data;
}

export type CreateIsencaoServicoBody = {
  codigoMatriculas: number[];
  codigoServico: number;
  codigoAnoLectivo: number;
};

export async function createIsencaoServico(body: CreateIsencaoServicoBody) {
  const { data } = await axiosNestFinance.post("/isencao", body);
  return data;
}

export type UpdateIsencaoServicoBody = {
  codigoMatricula?: number;
  codigoServico?: number;
  codigoAnoLectivo?: number;
  dataIsencao?: string;
  obs?: string;
  estadoIsencao?: string;
};

export async function updateIsencaoServico(
  codigo: number,
  body: UpdateIsencaoServicoBody,
) {
  const { data } = await axiosNestFinance.patch(`/isencao/${codigo}`, body);
  return data;
}
