import {
  fetchLogsParams,
  fetchLogsAccessos,
  LogsPaginatedResponse,
} from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryLogsAccesses(params?: Partial<fetchLogsParams>) {
  return useQuery<LogsPaginatedResponse, Error>({
    queryKey: ["logs-accesses", params],
    queryFn: () =>
      fetchLogsAccessos(params as fetchLogsParams),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
