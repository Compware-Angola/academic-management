
import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type CreateTipoCreditoEducacionalBody = {
  designacao: string;
  sigla: string
};

export async function createTipoCreditoEducacional(
  body: CreateTipoCreditoEducacionalBody
) {
  const { data } = await axiosNestFinance.post("/tipos-credito", body);

  return data;
}
