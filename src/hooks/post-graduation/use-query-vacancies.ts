import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationVacancies,
  FetchPostGraduationVacanciesParams,
  FetchPostGraduationVacanciesResponse,
} from "@/services/post-graduation/vacancies.service";

export const POST_GRADUATION_VACANCIES_QUERY_KEY =
  "post-graduation-vacancies";

export function useQueryPostGraduationVacancies(
  params: FetchPostGraduationVacanciesParams,
) {
  const enabled =
    params.academicYearId > 0 && [2, 3].includes(params.degreeId);

  return useQuery<FetchPostGraduationVacanciesResponse>({
    queryKey: [
      POST_GRADUATION_VACANCIES_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.courseId ?? null,
      params.periodId ?? null,
      params.page,
      params.limit,
    ],
    queryFn: () => fetchPostGraduationVacancies(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}
