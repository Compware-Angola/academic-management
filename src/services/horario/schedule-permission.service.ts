import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

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
  payload: SchedulePermissionPayload
): Promise<SchedulePermissionResponse> {
  const userId = AuthStorage.getUser().user_id;
  const { data } = await axiosNestGa.post<SchedulePermissionResponse>(
    "/schedule/permission",
    { userId, ...payload }
  );
  return data;
}
