import { axiosNestGa } from "@/lib/axios-nest-ga";

type DefineReitoriaPayload = {
  tipoCargoId: number;
  utilizadorId: number;
};

export async function defineReitoriaService(
  payload: DefineReitoriaPayload
): Promise<void> {
  await axiosNestGa.post("cargos-administrativos/reitoria", payload);
}
