import {
  AccessRestrictionPayload,
  createAccessRestriction,
} from "@/services/access/access-restrictions.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateAccessRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AccessRestrictionPayload) =>
      createAccessRestriction(payload),
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
