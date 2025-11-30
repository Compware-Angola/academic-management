import { fetchDefinirOral, FilterDefinirOralParams } from "@/services/avaliacao/fetch-oral";
import { useQuery } from "@tanstack/react-query";


export function useQueryDefinirOral(params:FilterDefinirOralParams) {
  return useQuery({
    queryKey: ["definir-oral", params],
    queryFn: () => fetchDefinirOral(params),
    enabled: !!params.cursoId && !!params.anoCurricular && !!params.semestre,
  });
}
