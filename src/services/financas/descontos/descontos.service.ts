import { axiosNestFinance } from "@/lib/axios-nest-finance.ts";

export type Desconto = {
  id: number;
  descricao: string;
  taxa: number;
  data_inicio: string;
  data_fim: string;
  obs: string;
  estado: boolean;
};

export type PaginationResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchDescontoParams = {
  codigo?: string;
  designacao?: string;
  percentual?: string | number;
  page?: number;
  limit?: number;
};

export async function fetchDescontos(
  params: FetchDescontoParams,
): Promise<PaginationResponse<Desconto>> {
  const { data } = await axiosNestFinance.get("/discount", {
    params: {
      codigo: params.codigo,
      designacao: params.designacao,
      percentual: params.percentual,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return data;
}

export type CreateDescontoBody = {
  descricao: string;
  taxa: number;
  data_inicio: string;
  data_fim: string;
  obs: string;
  estado: boolean;
};

export async function createDesconto(body: CreateDescontoBody) {
  const { data } = await axiosNestFinance.post("/discount", body);
  return data;
}

export async function updateDesconto(id: number, body: CreateDescontoBody) {
  const { data } = await axiosNestFinance.patch(`/discount/${id}`, body);
  return data;
}

export type AtribuirItem = {
  codigo_matricula: number;
  nome_completo: string;
  bilhete_identidade?: string | null;
  curso?: string | null;
  codigo_instituicao?: number | null;
  instituicao?: string | null;
  codigo_tipo_desconto?: number | null;
  descricao?: string | null;
  afectacao?: string | null;
  semestre?: number | null;
  taxa?: number | null;
  isentar_multa?: boolean | null;
  codigo_utilizador?: number | null;
  tipo_taxa_desconto_especial?: number | null;
  canal?: string | null;
  codigo_anolectivo?: number | null;
  ano_lectivo?: string | null;
  observacao?: string | null;
  created_at?: string | null;
  codigo?: number | null;
};

export type FetchDescontosAddParams = {
  page?: number;
  limit?: number;
  codigo?: string | number;
  codigoAnoLectivo?: string | number;
  semestre?: string | number;
  codigoMatricula?: string | number;
  codigoInstituicao?: string | number;
  afectacao?: string | number;
};

export async function fetchDescontosAdd(
  params: FetchDescontosAddParams,
): Promise<PaginationResponse<AtribuirItem>> {
  const { data } = await axiosNestFinance.get("/discount/add", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      codigo: params.codigo,
      codigoAnoLectivo: params.codigoAnoLectivo,
      semestre: params.semestre,
      codigoMatricula: params.codigoMatricula,
      codigoInstituicao: params.codigoInstituicao,
      afectacao: params?.afectacao,
    },
  });

  return data;
}

export type CreateDescontoAddBody = {
  observacao?: string | null;
  codigoMatricula: number;
  codigoTaxa: number;
  codigoInstituicao?: number | null;
  codigoAno?: number | null;
  semestre?: number | null;
  afectacao?: number;
};

export async function createDescontoAdd(body: CreateDescontoAddBody) {
  const { data } = await axiosNestFinance.post("/discount/add", body);
  return data;
}

export async function updateDescontoAdd(
  id: number,
  body: CreateDescontoAddBody,
) {
  const { data } = await axiosNestFinance.patch(`/discount/add/${id}`, body);
  return data;
}

export async function removeAddDiscount(codigo: number) {
  const { data } = await axiosNestFinance.delete(`/discount/add/${codigo}`);
  return data;
}
