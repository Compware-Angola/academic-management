import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreditoEducacionalTipoDesconto = {
  designacao: string;
  codigo: number;
};

export type CreditoEducacionalTipoDescontoResponse = {
  items: CreditoEducacionalTipoDesconto[];
};

export async function fetchCreditoEducacionalTipoDesconto(): Promise<CreditoEducacionalTipoDescontoResponse> {
  const { data } =
    await axiosApexGa.get<CreditoEducacionalTipoDescontoResponse>(
      "/financa/credito-educacional/tipo-desconto",
    );

  return data;
}
