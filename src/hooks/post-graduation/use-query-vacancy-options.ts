import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationVacancyOptions,
  PostGraduationVacancyOptions,
} from "@/services/post-graduation/vacancies.service";

export const POST_GRADUATION_VACANCY_OPTIONS_QUERY_KEY =
  "post-graduation-vacancy-options";

export function useQueryPostGraduationVacancyOptions(degreeId: number) {
  return useQuery<PostGraduationVacancyOptions>({
    queryKey: [POST_GRADUATION_VACANCY_OPTIONS_QUERY_KEY, degreeId],
    queryFn: () => fetchPostGraduationVacancyOptions(degreeId),
    enabled: [2, 3].includes(degreeId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
