import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type TipoServicoItem = {
  codigo: number;
  sigla: string;
  descricao: string;
  preco: number;
  tiposervico: string;
  codigo_ano_lectivo: number;
  estado: string;
  data: string;
  datacriacao: string;
  disponibilizar_aluno: string | null;
  visualizar_no_portal: string;
  polo_id: number;
  polo:string;
  taxa_iva_id:number;
  motivo_isencao_iva_codigo:number;
  canal: number;
  mestrado: string;
  codigo_grade_currilular: number | null;
  tipo_candidatura: number;
};

export type FetchTipoServicoPayload = {
  sigla?: string;
  descricao?: string;
  codigoAnoLectivo?: number;
  estado?: string;
  tipoServico?: string;
  visualizarNoPortal?: string;
};

export async function fetchTiposServico(
  payload: FetchTipoServicoPayload
): Promise<TipoServicoItem[]> {
  const { data } = await axiosNestFinance.get("/type-service", {
    params: {
      sigla: payload.sigla,
      descricao: payload.descricao,
      codigoAnoLectivo: payload.codigoAnoLectivo,
      estado: payload.estado,
      tipoServico: payload.tipoServico,
      visualizarNoPortal: payload.visualizarNoPortal,
    },
  });

  return data ?? [];
}


export type PaginationResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export type FetchTipoServicoPayloadPaginated = {
  sigla?: string;
  descricao?: string;
  codigoAnoLectivo?: number;
  polo?:number;
  estado?: string;
  tipoServico?: string;
  visualizarNoPortal?: string;
  page?: number;
  limit?: number;
};
export async function fetchTiposServicoAll(
  payload: FetchTipoServicoPayloadPaginated
): Promise<PaginationResponse<TipoServicoItem>> {
  const { data } = await axiosNestFinance.get("/type-service/all", {
    params: {
      sigla: payload.sigla,
      descricao: payload.descricao,
      codigoAnoLectivo: payload.codigoAnoLectivo,
      estado: payload.estado,
      polo:payload.polo,
      tipoServico: payload.tipoServico,
      visualizarNoPortal: payload.visualizarNoPortal,
      page: payload.page ?? 1,
      limit: payload.limit ?? 10,
    },
  });

  return data;
}

export async function fetchMonthlyFeeTipoServico(
  payload: Omit<FetchTipoServicoPayloadPaginated, "sigla">
): Promise<PaginationResponse<TipoServicoItem>> {
  const { data } = await axiosNestFinance.get("/type-service/monthly-fee", {
    params: {
      codigoAnoLectivo: payload.codigoAnoLectivo,
      estado: payload.estado,
       descricao: payload.descricao,
      tipoServico: payload.tipoServico,
      polo:payload.polo,
      visualizarNoPortal: payload.visualizarNoPortal,
      page: payload.page ?? 1,
      limit: payload.limit ?? 10,
    },
  });

  return data;
}
