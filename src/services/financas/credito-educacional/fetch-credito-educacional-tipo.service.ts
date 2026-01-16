import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreditoEducacionalTipo = {
  designacao: string;
  codigo: number;
};

export type CreditoEducacionalTipoResponse = {
  items: CreditoEducacionalTipo[];
};

export async function fetchCreditoEducacionalTipo(): Promise<CreditoEducacionalTipoResponse> {
  const { data } = await axiosApexGa.get<CreditoEducacionalTipoResponse>(
    "/financa/credito-educacional/tipo"
  );

  return data;
}
