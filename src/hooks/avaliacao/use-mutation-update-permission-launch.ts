import {
  updatePermissionAssessment,
  UpdatePermissionPayload,
} from "@/services/avaliacao/update-permission-launch.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdatePermissionAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      permissionId,
      payload,
    }: {
      permissionId: number;
      payload: UpdatePermissionPayload;
    }) => updatePermissionAssessment({ permissionId, payload }),

    onSuccess: () => {
      // Recarrega a lista de permissões de avaliação
      queryClient.invalidateQueries({
        queryKey: ["assessment-permissions"],
      });
    },
  });
};
