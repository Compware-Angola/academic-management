import { fetchGrupos, FetchGruposParams, GruposResponse } from "@/services/access/fetch-grupos.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryGrupos(params?: FetchGruposParams){
    return useQuery<GruposResponse[]>({
        queryKey: ["grupos-filter", params],
        queryFn: () => fetchGrupos(params),
        
    })
}