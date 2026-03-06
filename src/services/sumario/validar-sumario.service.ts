import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function validarSumario(
  codigo: number,
  estado: number
): Promise<void> {
  await axiosNestGa.patch(`sumario/${codigo}/validar/${estado}`, {});
}