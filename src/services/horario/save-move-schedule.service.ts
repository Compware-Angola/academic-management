import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =========================
 * Types
 * ========================= */

export type MoveStudentsPayload = {
  studentsCurriculumIds: number[];
  fromScheduleId: number;
  toScheduleId: number;
};

export type MoveStudentsResponse = {
  sucesso: number; // 1 | 0
  mensagem: string;
};

/* =========================
 * Service
 * ========================= */

export async function moveStudentsService(
  userId: number,
  payload: MoveStudentsPayload
): Promise<MoveStudentsResponse> {
  const { data } = await axiosNestGa.post(
    `/schedule/move-students/${userId}`,
    payload
  );

  return data;
}
