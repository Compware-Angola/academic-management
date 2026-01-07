import fetchEstadoCivil from "@/services/access/referencias/estado-civil.service";
import { useQuery } from "@tanstack/react-query";




export function useQueryEstadoCivil(){
    return useQuery({
        queryKey: ["estado-civil"],
        queryFn: fetchEstadoCivil,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}