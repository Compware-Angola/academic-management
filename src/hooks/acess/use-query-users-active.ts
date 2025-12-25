import { User } from "@/services/access/fect-users.service";
import { fetchUserActive, FetchUserParams } from "@/services/access/fetch-user-ativos.service";
import { useQuery } from "@tanstack/react-query";



export function usersQueryActive(params?: FetchUserParams){
    return useQuery<User[]>({
        queryKey: ["users-active", params],
        queryFn: () => fetchUserActive(params),
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
    })
}