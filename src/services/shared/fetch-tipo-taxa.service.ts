import { axiosNestFinance } from "@/lib/axios-nest-finance";

 export interface TipoTaxaResponse {
  id: number;
  taxa: number;
  descricao: string;
}

export async function fetchTipoTaxaDropdown(): Promise<TipoTaxaResponse[]> {
  const { data } = await axiosNestFinance.get<TipoTaxaResponse[]>(
    "/shared/tipo-taxa-dropdown"
  );

  return data;
}
