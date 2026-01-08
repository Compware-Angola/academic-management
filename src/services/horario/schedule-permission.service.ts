import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface SchedulePermissionPayload {
  fkHorario: number;
  dataInicio: string;
  dataFim: string;
}

export interface SchedulePermissionResponse {
  success: boolean;
  message: string;
}

export async function createSchedulePermission(
  userId: number,
  payload: SchedulePermissionPayload
): Promise<SchedulePermissionResponse> {
  const { data } = await axiosNestGa.post<SchedulePermissionResponse>(
    "/schedule/permission",
    { userId, ...payload }
  );
  return data;
}
