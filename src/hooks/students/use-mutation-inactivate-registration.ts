import {
  inactivateRegistration,
  InactivateRegistrationPayload,
} from "@/services/students/inactivate-registration.service";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationInactivateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InactivateRegistrationPayload) =>
      inactivateRegistration(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student-detail"],
      });

      toast.success(data.message);
    },

    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao inativar matrícula";

      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}
