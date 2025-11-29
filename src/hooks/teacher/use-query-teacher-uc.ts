import { fetchTeacherByUC,Teacher } from "@/services/teachers/fecth-teacher-by-uc";
import { useQuery } from "@tanstack/react-query";

export function useQueryTeacherByUC(unidadeCurricular?:string) {
  return useQuery<Teacher[], Error>({
    queryKey: ["teachers-by-uc",unidadeCurricular],
    queryFn: () => fetchTeacherByUC(unidadeCurricular),
    enabled: !!unidadeCurricular,
   staleTime: 5 * 60 * 1000,

  });
}
