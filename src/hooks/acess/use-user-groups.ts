// src/hooks/queries/use-user-groups.ts
import { fetchUserGroups, UserGroup } from "@/services/access/fetch-user-group.service";
import { useQuery } from "@tanstack/react-query";

interface UseUserGroupsOptions {
  userId: number;
  enabled?: boolean; // permite desativar a query se o userId ainda não existir
}

export function useUserGroups({ userId, enabled = true }: UseUserGroupsOptions) {
  return useQuery<UserGroup[], Error>({
    queryKey: ["user-groups", userId],      // chave única por utilizador
    queryFn: () => fetchUserGroups(userId),
    enabled: enabled && !!userId,           // só executa se userId existir e enabled for true
    staleTime: 1000 * 60 * 15,              // 15 minutos

    retry: 2,
  });
}