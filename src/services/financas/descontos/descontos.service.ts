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
  page?: number;
  limit?: number;
};

export async function fetchDescontos(params: FetchDescontoParams): Promise<PaginationResponse<Desconto>> {
  const { data } = await axiosNestFinance.get("/discount", {
    params: {
      codigo: params.codigo,
      designacao: params.designacao,
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
