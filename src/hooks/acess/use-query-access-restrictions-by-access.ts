import {
  AccessRestrictionByAccess,
  fetchAccessRestrictionsByAccess,
} from "@/services/access/access-restrictions.service";
import { useQuery } from "@tanstack/react-query";

type UseAccessRestrictionsByAccessOptions = {
  codigoAcesso: number;
  enabled?: boolean;
};

export function useAccessRestrictionsByAccess({
  codigoAcesso,
  enabled = true,
}: UseAccessRestrictionsByAccessOptions) {
  return useQuery<AccessRestrictionByAccess[]>({
    queryKey: ["access-restrictions-by-access", codigoAcesso],
    queryFn: () => fetchAccessRestrictionsByAccess(codigoAcesso),
    enabled: enabled && codigoAcesso > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
