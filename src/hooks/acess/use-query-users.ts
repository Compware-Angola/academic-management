import { useQuery } from "@tanstack/react-query";
import { fetchUsers, FetchUsersParams, UsersResponse } from "@/services/access/fect-users.service";
export function useUsers(params: FetchUsersParams = {}) {
  return useQuery<UsersResponse, Error>({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

