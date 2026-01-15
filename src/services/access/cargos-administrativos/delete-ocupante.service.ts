import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function deleteOcupanteCargoService(
  cargoId: number
): Promise<void> {
  await axiosNestGa.delete(`cargos-administrativos/${cargoId}/ocupante`);
}
