import { Discipline, fetchDisciplines } from "@/services/study_plan/fect-discipline.serice";
import { fetchTeacher, Teacher } from "@/services/teacthers/fecth-teacher";
import { useQuery } from "@tanstack/react-query";

export function useQueryTeacther() {
  return useQuery<Teacher[], Error>({
    queryKey: ["teachers"],
    queryFn: fetchTeacher,
   staleTime: 5 * 60 * 1000,
   
  });
}