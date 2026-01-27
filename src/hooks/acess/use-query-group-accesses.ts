// src/hooks/queries/use-group-accesses.ts
import { Access, fetchGroupAccesses } from "@/services/access/fecth-access.service";
import { useQuery } from "@tanstack/react-query";


interface UseGroupAccessesOptions {
  groupId: number;
  enabled?: boolean;
}

export function useGroupAccesses({ groupId, enabled = true }: UseGroupAccessesOptions) {
  return useQuery<Access[], Error>({
    queryKey: ["group-accesses", groupId],
    queryFn: () => fetchGroupAccesses(groupId),
    enabled: enabled && groupId > 0,
    
  });
}