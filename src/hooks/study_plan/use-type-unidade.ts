// src/hooks/study_plan/use-tipos-unidade.ts
import { useQuery } from "@tanstack/react-query";
import { TipoUnidade, getTiposUnidade } from "@/services/study_plan/fetch-type-unidade.service";
export function useTiposUnidade() {
  return useQuery<TipoUnidade[], Error>({
    queryKey: ["type-unidade"],
    queryFn: getTiposUnidade,
    staleTime: 1000 * 60 * 30,
  });
}