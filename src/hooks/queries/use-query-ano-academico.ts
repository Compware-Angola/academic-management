import {
  AnoAcademico,
  fetchAnosAcademicos,
} from "@/services/fetch-anos-academico";
import { useQuery } from "@tanstack/react-query";

export function useQueryAnoAcademico(params?: { tipo_candidatura?: number }) {
  return useQuery<AnoAcademico[]>({
    queryKey: ["anosLetivos", params?.tipo_candidatura],
    queryFn: () => fetchAnosAcademicos(params),
    staleTime: 1 * 60 * 60 * 1000,
  });
}
