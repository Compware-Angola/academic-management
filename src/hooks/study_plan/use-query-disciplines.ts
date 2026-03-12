// src/hooks/ga/use-disciplines.ts
import { fetchDisciplines, DisciplinesResponse,DisciplineParams } from "@/services/study_plan/fect-discipline.serice";
import { useQuery } from "@tanstack/react-query";

export function useDisciplines(params?: DisciplineParams) {
  return useQuery<DisciplinesResponse, Error>({
    queryKey: ["disciplines", params],
    queryFn: () => fetchDisciplines(params),
    staleTime: 1000 * 60 * 30, 
   
  });
}