import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DeleteSchedulePayload = {
  horarioId: number | string;
  userId: number | string;
};

export async function deleteScheduleService(
  payload: DeleteSchedulePayload,
): Promise<void> {
  const { horarioId, userId } = payload;

  await axiosNestGa.delete(`/schedule/${horarioId}/excluir/${userId}`);
}
