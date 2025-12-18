import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =======================
 * PAYLOAD
 * ======================= */
export interface UpdateSchedulePermissionPayload {
  dataInicio?: string;
  dataFim?: string;
  ativeState?: number; // 1 ou 0
}

/* =======================
 * UPDATE
 * ======================= */
export const updateScheduleWithPermission = async ({
  permissionId,
  payload,
}: {
  permissionId: number;
  payload: UpdateSchedulePermissionPayload;
}) => {
  const response = await axiosNestGa.put(
    `/schedule/with-permission/${permissionId}`,
    payload
  );

  return response.data;
};
