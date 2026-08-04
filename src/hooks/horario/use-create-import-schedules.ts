import {
  createImportSchedules,
  ImportSchedulesPayload,
} from "@/services/horario/create-import-horario";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateImportSchedules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportSchedulesPayload) =>
      createImportSchedules(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["import-schedules"],
      });
    },
  });
};
