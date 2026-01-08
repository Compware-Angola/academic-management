import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface RestaurarHorarioParams {
  codigo: number;
}

export async function restaurarHorarioService(
  utilizadorId: number,
  { codigo }: RestaurarHorarioParams
) {
  const { data } = await axiosNestGa.patch(
    `/schedule/${codigo}/restaurar/${utilizadorId}`
  );

  return data;
}
