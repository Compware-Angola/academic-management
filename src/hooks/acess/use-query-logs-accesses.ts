import { createLogsParams, fetchLogsAccessos, LogsPaginatedResponse, tipoLogsAccesses } from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryLogsAccesses(params?: createLogsParams){

    return useQuery<LogsPaginatedResponse, Error>({
        queryKey: ["logs-accesses", params],
        queryFn: () => fetchLogsAccessos(params as createLogsParams),
        enabled: !!params,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}