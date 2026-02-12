import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type CreditoEducacionalTipo = {
  designacao: string;
  codigo: number;
  sigla: string;
  status: number;
};

export type TipoCreditoFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  deleted?: boolean;

};

export type CreditoEducacionalTipoResponse = {
  data: CreditoEducacionalTipo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchCreditoEducacionalTipo(filters?: TipoCreditoFilters): Promise<CreditoEducacionalTipoResponse> {
  const { data } = await axiosNestFinance.get<CreditoEducacionalTipoResponse>(
    "/tipos-credito",
    {
      params: filters,
    }
  );

  return data;
}
