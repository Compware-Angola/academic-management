import {
  GetUsersByGroupPayload,
  GetUsersByGroupResponse,
  getUsersByGroupService,
} from "@/services/access/fetch-user-grouo.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryUsersByGroup = (
  filters: GetUsersByGroupPayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const { pkGrupo, page, limit, nome, pkUser } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!pkGrupo;

  return useQuery<GetUsersByGroupResponse>({
    queryKey: [
      "users-by-group",
      {
        pkGrupo,
        page,
        limit,
        nome,
        pkUser,
      },
    ],

    queryFn: () => getUsersByGroupService(filters),

    enabled,

    staleTime: 1000 * 60 * 10, // 10 min
    gcTime: 1000 * 60 * 30, // 30 min
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
