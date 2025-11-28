import { fetchTemposDisponiveis, TempoDisponivelItem } from "@/services/tempos/tempos-disponiveis";
import { useQuery } from "@tanstack/react-query";


export function useQueryTemposDisponiveis(
{anoLectivo,periodo}:  { anoLectivo?: number,
    periodo?: number}
) {
  return useQuery<TempoDisponivelItem[]>({
    queryKey: ["tempos-disponiveis", anoLectivo, periodo],
    queryFn: () => fetchTemposDisponiveis(anoLectivo, periodo),
    staleTime: 1 * 60 * 60 * 1000,
    enabled: !!anoLectivo && !!periodo,
  });
}
