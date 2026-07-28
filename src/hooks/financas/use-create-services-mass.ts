import {
  createServicesMass,
  CreateServicesMassPayload,
} from "@/services/financas/create-services-mass";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateServicesMass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicesMassPayload) =>
      createServicesMass(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-services-by-year"],
      });

      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
  });
}
