import {
  DocenteUc,
  fetchTeacherByUc,
} from "@/services/teacher/fetch-teacher-uc.service";
import { useQuery } from "@tanstack/react-query";

type UseQueryTeacherByUcParams = {
  anoLectivo?: number;
  unidadeCurricular?: number;
};

export function useQueryTeacherByUcAndAcademicYear(
  params: UseQueryTeacherByUcParams = {}
) {
  return useQuery<DocenteUc[], Error>({
    queryKey: ["teacher-by-uc", params.anoLectivo, params.unidadeCurricular],
    queryFn: async () => {
      if (!params.anoLectivo || !params.unidadeCurricular) {
        return [];
      }

      return fetchTeacherByUc({
        anoLectivo: params.anoLectivo,
        unidadeCurricular: params.unidadeCurricular,
      });
    },
    enabled: !!params.anoLectivo && !!params.unidadeCurricular,
    staleTime: 5 * 60 * 1000,
  });
}
