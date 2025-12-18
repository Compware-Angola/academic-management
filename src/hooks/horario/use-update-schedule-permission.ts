import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateScheduleWithPermission,
  UpdateSchedulePermissionPayload,
} from "@/services/horario/update-schedule-with-permission.service";

export const useUpdateSchedulePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      permissionId,
      payload,
    }: {
      permissionId: number;
      payload: UpdateSchedulePermissionPayload;
    }) => updateScheduleWithPermission({ permissionId, payload }),

    onSuccess: () => {
      // Recarrega a lista com permissões
      queryClient.invalidateQueries({
        queryKey: ["schedule-with-permission"],
      });
    },
  });
};
