import { AcessosUtilizadorResponse, fetchAcessosUtilizador } from "@/services/access/fetch-accesses-user.service";
import { useQuery } from "@tanstack/react-query";


export function useAcessosUtilizador(){

    return useQuery<AcessosUtilizadorResponse[]>({
        queryKey: ["utilizador-acessos"],
        queryFn: () => fetchAcessosUtilizador(),
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
    })
}