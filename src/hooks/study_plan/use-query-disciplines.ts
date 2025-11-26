// src/hooks/ga/use-disciplines.ts
import { Discipline, fetchDisciplines } from "@/services/study_plan/fect-discipline.serice";
import { useQuery } from "@tanstack/react-query";

export function useDisciplines() {
  return useQuery<Discipline[], Error>({
    queryKey: ["disciplines"],
    queryFn: fetchDisciplines,
    staleTime: 1000 * 60 * 30, 
   
  });
}