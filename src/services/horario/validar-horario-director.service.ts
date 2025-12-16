import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ValidarHorarioDirectoPayload = {
  horarioId: number | string;
  userId: number | string;
};

export async function validarHorarioDirectorService(
  payload: ValidarHorarioDirectoPayload,
): Promise<void> {
  const { horarioId, userId } = payload;

  await axiosNestGa.patch(`/schedule/${horarioId}/validar/${userId}`);
}
