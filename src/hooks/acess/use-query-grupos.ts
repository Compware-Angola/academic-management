import { fetchGrupos, FetchGruposParams, GruposResponse } from "@/services/access/fetch-grupos.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryGrupos(params?: FetchGruposParams){
    return useQuery<GruposResponse[]>({
        queryKey: ["grupos-filter", params],
        queryFn: () => fetchGrupos(params),
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
    })
}