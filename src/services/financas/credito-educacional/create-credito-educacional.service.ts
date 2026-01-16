import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreateCreditoEducacionalBody = {
  designacao: string;
  codigoTipoDesconto: number;
  valorDesconto: number;
  codigoTipoCredito: number;
};

export async function createCreditoEducacional(
  body: CreateCreditoEducacionalBody
) {
  const { data } = await axiosApexGa.post("/financa/credito-educacional", body);

  return data;
}
