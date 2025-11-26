// src/hooks/study_plan/use-classes.ts
import { useQuery } from "@tanstack/react-query";
import { getClasses, Classe } from "@/services/fetch-class";
export function useClasses() {
  return useQuery<Classe[], Error>({
    queryKey: ["classes"],
    queryFn: getClasses,
    staleTime: 1000 * 60 * 60
  });
}