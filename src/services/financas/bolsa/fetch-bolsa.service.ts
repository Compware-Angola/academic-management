import { axiosApexGa } from "@/lib/axios-apex-ga";
export type FetchBolsaParams = {
  designacao?: string;
  instituicao?: string;
};
export type Bolsa = {
  codigo: number;
  designacao: string;
  codigo_instituicao: number;
  instituicao: string;
  valor_desconto: number;
  codigo_tipo_desconto: number;
  descricao_tipo_desconto: string;
  codigo_tipo_credito: number;
  descricao_tipo_credito: string;
};
export type PaginationLink = {
  $ref: string;
};

export type FetchBolsaResponse = {
  items: Bolsa[];
  first?: PaginationLink;
  next?: PaginationLink;
  prev?: PaginationLink;
};

export async function fetchBolsaService(
  params?: FetchBolsaParams,
  url?: string,
): Promise<FetchBolsaResponse> {
  if (url) {
    const { data } = await axiosApexGa.get<FetchBolsaResponse>(url);
    return data;
  }

  const { data } = await axiosApexGa.get<FetchBolsaResponse>("/financa/bolsa", {
    params,
  });

  return data;
}
