import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreditoEducacional = {
  designacao: string;
  codigo_tipo_desconto: number | null;
  valor_desconto: number | null;
  codigo_tipo_credito: number | null;
  codigo: number;
};

export type CreditoEducacionalResponse = {
  items: CreditoEducacional[];
};

export type FetchCreditoEducacionalParams = {
  designacao?: string;
  codigoTipoDesconto?: string;
  codigoTipoCredito?: string;
};

export async function fetchCreditoEducacional(
  params?: FetchCreditoEducacionalParams
): Promise<CreditoEducacionalResponse> {
  const { data } = await axiosApexGa.get("/financa/credito-educacional", {
    params,
  });

  return data ?? [];
}
