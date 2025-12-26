import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdatePermissionPayload {
  dataInicio?: string;
  dataFim?: string;
  ativeState?: number; // 1 ou 0
}

export const updatePermissionAssessment = async ({
  permissionId,
  payload,
}: {
  permissionId: number;
  payload: UpdatePermissionPayload;
}) => {
  const response = await axiosNestGa.put(
    `/assessment/permissoes/${permissionId}`,
    payload
  );

  return response.data;
};
