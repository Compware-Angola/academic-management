import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateAcessoEstadoPayload = {
  acessoId: number | string;
  userId: number | string;
};

export async function updateEstadoAcessoService(
  payload: UpdateAcessoEstadoPayload,
): Promise<void> {
  const { acessoId, userId } = payload;

await axiosNestGa.put(
  `/acess_management/${acessoId}/estado/${userId}`,
);


}
