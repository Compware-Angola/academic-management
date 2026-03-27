
import { useQuery } from "@tanstack/react-query";
import {
  fetchResultadoProva,
  ResultadoProvaParams,
} from "@/services/access_exam/fetch-resultado-prova.service";

export function useResultadoProva(
  params: ResultadoProvaParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["resultado-prova", params],
    queryFn: () => fetchResultadoProva(params),
    enabled: options?.enabled ?? true,
  });
}