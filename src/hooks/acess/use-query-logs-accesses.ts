import { createLogsParams, fetchLogsAccessos, tipoLogsAccesses } from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";



export function useQueryLogsAccesses(params?: createLogsParams){
    return useQuery<tipoLogsAccesses[], Error>({
        queryKey: ["logs-accesses", params ?? {}],
        queryFn: () => fetchLogsAccessos(params ?? {dataInicio: "", dataFim: ""}),

        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}