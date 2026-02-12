import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type DeleteTipoCreditoEducacionalBody = {
    id: number
};

export async function deleteTipoCreditoEducacional(
    body: DeleteTipoCreditoEducacionalBody
) {
    const { data } = await axiosNestFinance.delete<{ message: string }>(`/tipos-credito/${body.id}`);
    return data;
}
