import {
  fetchSemestres,
  Semestre,
} from "@/services/study_plan/semestre/fecth-semestres";
import { useQuery } from "@tanstack/react-query";

export function useQuerySemestres() {
  return useQuery<Semestre[]>({
    queryKey: ["semestres"],
    queryFn: fetchSemestres,
    staleTime: 1 * 60 * 60 * 1000,
  });
}
