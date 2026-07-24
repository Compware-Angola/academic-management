import {
  Discipline,
  fetchDisciplines,
} from "@/services/study_plan/fect-discipline.serice";
import {
  fetchTeacher,
  Teacher,
  TeacherParams,
} from "@/services/teachers/fecth-teacher";
import { useQuery } from "@tanstack/react-query";

export function useQueryTeacther(params?: TeacherParams) {
  return useQuery<Teacher[], Error>({
    queryKey: ["teachers", params],
    queryFn: () => fetchTeacher(params),
    staleTime: 5 * 60 * 1000,
  });
}
