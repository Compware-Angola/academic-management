import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
  updateAgendaValidationStatus,
  UpdateAgendaValidationStatusPayload,
} from "@/services/post-graduation/update-agenda-validation-status.service";
import { POST_GRADUATION_AGENDA_VALIDATIONS_QUERY_KEY } from "./use-query-agenda-validations";
import { POST_GRADUATION_MISSING_AGENDA_VALIDATIONS_QUERY_KEY } from "./use-query-missing-agenda-validations";

export function useMutationUpdateAgendaValidationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateAgendaValidationStatusPayload) =>
      updateAgendaValidationStatus(payload),
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_AGENDA_VALIDATIONS_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            POST_GRADUATION_MISSING_AGENDA_VALIDATIONS_QUERY_KEY,
          ],
        }),
      ]);

      toast({ title: response.message });
    },
  });
}
