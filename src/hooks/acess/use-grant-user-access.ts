// hooks/access/use-grant-user-access.ts
import { useMutation } from "@tanstack/react-query";
import { grantUserAccess } from "@/services/access/grant-user-access.service";

type GrantUserAccessParams = {
  utilizadorId: number;
  acessoId: number;
};

export function useGrantUserAccess() {
  return useMutation({
    mutationFn: ({ utilizadorId, acessoId }: GrantUserAccessParams) =>
      grantUserAccess(utilizadorId, acessoId),
  });
}
