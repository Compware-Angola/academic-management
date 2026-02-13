import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type RestoreTipoCreditoEducacionalBody = {
    id: number
};

export async function restoreTipoCreditoEducacional(
    body: RestoreTipoCreditoEducacionalBody
) {
    const { data } = await axiosNestFinance.put<{ message: string }>(`/tipos-credito/${body.id}/restore`);
    return data;
}
