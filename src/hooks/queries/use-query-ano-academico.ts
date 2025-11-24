import {
  AnoAcademico,
  fetchAnosAcademicos,
} from "@/services/fetch-anos-academico";
import { useQuery } from "@tanstack/react-query";

export function useQueryAnoAcademico() {
  return useQuery<AnoAcademico[]>({
    queryKey: ["anosLetivos"],
    select: (anos) =>
      anos.filter(
        (a) =>
          !a.designacao.toLowerCase().includes("doutoramento") &&
          !a.designacao.toLowerCase().includes("mestrado"),
      ),
    queryFn: fetchAnosAcademicos,
    staleTime: 1 * 60 * 60 * 1000,
  });
}
