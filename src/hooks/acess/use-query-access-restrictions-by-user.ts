import {
  AccessRestrictionByUser,
  fetchAccessRestrictionsByUser,
} from "@/services/access/access-restrictions.service";
import { useQuery } from "@tanstack/react-query";

type UseAccessRestrictionsByUserOptions = {
  codigoUtilizador: number;
  enabled?: boolean;
};

export function useAccessRestrictionsByUser({
  codigoUtilizador,
  enabled = true,
}: UseAccessRestrictionsByUserOptions) {
  return useQuery<AccessRestrictionByUser[]>({
    queryKey: ["access-restrictions-by-user", codigoUtilizador],
    queryFn: () => fetchAccessRestrictionsByUser(codigoUtilizador),
    enabled: enabled && codigoUtilizador > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
