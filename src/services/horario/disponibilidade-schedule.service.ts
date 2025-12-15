import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateSchedulePayload = {
  horarioId: number | string;
  userId: number | string;
};

export async function updateDisponibilidadeService(
  payload: UpdateSchedulePayload,
): Promise<void> {
  const { horarioId, userId } = payload;

  await axiosNestGa.patch(`/schedule/${horarioId}/disponibilidade/${userId}`);
}
