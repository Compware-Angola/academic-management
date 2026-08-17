import {
  fetchLogsFilterOptions,
  LogsFilterOptions,
} from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryLogsFilterOptions() {
  return useQuery<LogsFilterOptions, Error>({
    queryKey: ["logs-filter-options"],
    queryFn: () => fetchLogsFilterOptions(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
