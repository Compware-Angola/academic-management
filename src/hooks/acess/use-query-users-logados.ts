
import { useQuery } from "@tanstack/react-query";

import { fetchUsersLogados, FilterUsersLogadoParams, UsersLogadoPaginatedResponse } from "@/services/access/fetch-user-logado.service";



export function useQueryUsersLogados(params?: FilterUsersLogadoParams) {
  const { estado, search, page = 1, limit = 10 } = params ?? {};

  return useQuery<UsersLogadoPaginatedResponse, Error>({
    queryKey: [
      "users-logados",
      estado ?? 1,           // valor default se undefined
      search,          // ou null/undefined → ""
      page,
      limit,
    ],

    queryFn: () => fetchUsersLogados(params),

    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,

  });
}