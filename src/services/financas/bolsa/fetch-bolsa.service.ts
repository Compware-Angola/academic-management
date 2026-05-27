import { axiosNestFinance } from "@/lib/axios-nest-finance";
export type FetchBolsaParams = {
  designacao?: string;
  codigoInstituicao?: string;
  codigoTipoCredito?: string;
  codigoTipoDesconto?: string;
  page?: string;
  limit?: string;
};

export type Bolsa = {
  codigo: number;
  designacao?: string;
  codigo_instituicao: number;
  instituicao?: string;
  valor_desconto: number;
  codigo_tipo_desconto: number;
  descricao_tipo_desconto: string;
  codigo_tipo_credito: number;
  descricao_tipo_credito: string;
  estado: 0 | 1;
};

export type MetaBolsa = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchBolsaResponse = {
  data: Bolsa[];
  meta: MetaBolsa;
};

export async function fetchBolsaService(
  params?: FetchBolsaParams,
): Promise<FetchBolsaResponse> {
  const { data } = await axiosNestFinance.get<FetchBolsaResponse>("/bolsa", {
    params,
  });

  return data;
}
