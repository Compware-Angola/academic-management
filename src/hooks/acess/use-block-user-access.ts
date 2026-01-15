// hooks/access/use-grant-user-access.ts
import { useMutation } from "@tanstack/react-query";
import { BlockUserAccess } from "@/services/access/block-access-user.service";

type BlockUserAccessParams = {
  utilizadorId: number;
  acessoId: number;
};

export function useBlockUserAccess() {
  return useMutation({
    mutationFn: ({ utilizadorId, acessoId }: BlockUserAccessParams) =>
      BlockUserAccess(utilizadorId, acessoId),
  });
}
