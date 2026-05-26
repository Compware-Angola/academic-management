import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateBolsaService,
  UpdateBolsaRequest,
} from "@/services/financas/bolsa/update-bolsa.service";

export function useMutationUpdateBolsa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBolsaRequest) => updateBolsaService(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bolsa"],
      });
    },
  });
}
