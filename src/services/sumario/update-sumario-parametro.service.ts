import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateParametroPayload {
  args: {
    valor: number | boolean;
  };
}

export async function updateSumarioParametro(
  id: number,
  payload: UpdateParametroPayload
): Promise<void> {
  await axiosNestGa.patch(`sumario/parametros/${id}`, payload);
}