import { useQuery } from "@tanstack/react-query";
import { fetchNotaPrevista, NotaPrevistaParams } from "@/services/access_exam/fetch-resultado-nota-prevista.service";

export function useNotaPrevista(
  params: NotaPrevistaParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["nota-prevista", params],
    queryFn: () => fetchNotaPrevista(params),
    enabled: options?.enabled ?? true,
  });
}