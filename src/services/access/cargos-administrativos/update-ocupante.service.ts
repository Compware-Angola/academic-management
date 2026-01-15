import { axiosNestGa } from "@/lib/axios-nest-ga";

type UpdateOcupantePayload = {
  novoUtilizadorId: number;
};

export async function updateOcupanteCargoService(
  cargoId: number,
  payload: UpdateOcupantePayload
): Promise<void> {
  await axiosNestGa.put(`cargos-administrativos/${cargoId}/ocupante`, payload);
}
