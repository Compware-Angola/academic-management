import { axiosNestFinance } from "@/lib/axios-nest-finance.ts";

export type IsencaoMulta = {
  codigo_matricula: number;
  nome_completo: string;
  bilhete: string;
  curso: string;
  candidatura: string;
  servico: string;
  estado: string;
  ano_lectivo: string;
  data_isencao: string;
  mes_temp: string;
};

export type PaginationResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export type FetchIsencaoMultaPayloadPaginated = {
  codigoMatricula?: number;
  codigoServico?: number;
  codigoCurso?: number;
  faculdadeId?: number;
  anoLectivo?: number;
  estadoIsencao?: string;
  mesTempId?: number;
  page?: number;
  limit?: number;
};

export async function fetchIsencaoMultaAll(
  payload: FetchIsencaoMultaPayloadPaginated,
): Promise<PaginationResponse<IsencaoMulta>> {
  const {
    codigoMatricula,
    codigoServico,
    codigoCurso,
    faculdadeId,
    anoLectivo,
    estadoIsencao,
    mesTempId,
    page,
    limit,
  } = payload;

  const { data } = await axiosNestFinance.get("/isencao/multas", {
    params: {
      codigoMatricula,
      codigoServico,
      codigoCurso,
      faculdadeId,
      anoLectivo,
      estadoIsencao,
      mesTempId,
      page: page ?? 1,
      limit: limit ?? 10,
    },
  });

  return data;
}

export type MesTemp = {
  mesTempId: number;
  servicoId: number;
};

export type CreateIsencaoMultaBody = {
  codigoMatricula: number;
  mesTemps: MesTemp[];
  codigoAnoLectivo: number;
  codigoPreInscricao?: number;
  codigoUtilizador?: number;
  canal?: number;
  obs?: string;
};

export async function createIsencaoMulta(body: CreateIsencaoMultaBody) {
  const { data } = await axiosNestFinance.post("/isencao/multa", body);

  return data;
}
