// hooks/access/use-grant-user-access.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlockUserAccess } from "@/services/access/block-access-user.service";

type BlockUserAccessParams = {
  utilizadorId: number;
  acessoId: number;
};

export function useBlockUserAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ utilizadorId, acessoId }: BlockUserAccessParams) =>
      BlockUserAccess(utilizadorId, acessoId),

    onSuccess: (_, variables) => {
    
      queryClient.invalidateQueries({
        queryKey: ["user-groups", variables.utilizadorId],
      });
    },
  });
}