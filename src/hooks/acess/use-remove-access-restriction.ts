import {
  AccessRestrictionPayload,
  removeAccessRestriction,
} from "@/services/access/access-restrictions.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveAccessRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AccessRestrictionPayload) =>
      removeAccessRestriction(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "access-restrictions-by-user",
          variables.codigoUtilizador,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["access-restrictions-by-access", variables.codigoAcesso],
      });
    },
  });
}
