import { fetchUserActive, FetchUserParams, UserFilterResponse } from "@/services/access/fetch-user-ativos-or-inativos.service";
import { useQuery } from "@tanstack/react-query";


export function usersQueryActive(params?: FetchUserParams){
    return useQuery<UserFilterResponse[]>({
        queryKey: ["users-filters", params],
        queryFn: () => fetchUserActive(params),
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
    })
}