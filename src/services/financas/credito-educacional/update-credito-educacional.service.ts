import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type UpdateTipoCreditoEducacionalBody = {
  data: {
    designacao?: string;
    sigla?: string
  }
  id: number
};

export async function updateTipoCreditoEducacional(
  body: UpdateTipoCreditoEducacionalBody
) {
  const { data } = await axiosNestFinance.put(`/tipos-credito/${body.id}`, {
    designacao: body.data.designacao,
    sigla: body.data.sigla
  });

  return data;
}
