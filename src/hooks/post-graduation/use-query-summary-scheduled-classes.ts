import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationSummaryScheduledClasses,
  PostGraduationSummaryScheduledClassesParams,
  PostGraduationSummaryScheduledClassesResponse,
} from "@/services/post-graduation/summaries.service";

export const POST_GRADUATION_SUMMARY_SCHEDULED_CLASSES_QUERY_KEY =
  "post-graduation-summary-scheduled-classes";

export function useQueryPostGraduationSummaryScheduledClasses(
  filters: PostGraduationSummaryScheduledClassesParams,
) {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado,
    anoLectivo,
    semestre,
    degreeId,
    page = 1,
    limit = 20,
  } = filters;

  const hasAno = anoLectivo !== undefined && !Number.isNaN(Number(anoLectivo));
  const hasBothDates =
    dataInicial !== undefined &&
    dataInicial !== "" &&
    dataFinal !== undefined &&
    dataFinal !== "" &&
    !Number.isNaN(Date.parse(dataInicial)) &&
    !Number.isNaN(Date.parse(dataFinal));

  const payload: PostGraduationSummaryScheduledClassesParams = {
    page,
    limit,
    ...(unidadeCurricular !== undefined &&
      Number(unidadeCurricular) > 0 && {
        unidadeCurricular: Number(unidadeCurricular),
      }),
    ...(docente !== undefined &&
      Number(docente) > 0 && { docente: Number(docente) }),
    ...(estado !== undefined &&
      Number(estado) >= 1 && { estado: Number(estado) }),
    ...(hasAno && { anoLectivo: Number(anoLectivo) }),
    ...(semestre !== undefined &&
      Number(semestre) > 0 && { semestre: Number(semestre) }),
    ...(degreeId !== undefined &&
      [2, 3].includes(Number(degreeId)) && { degreeId: Number(degreeId) }),
    ...(hasBothDates && { dataInicial, dataFinal }),
  };

  return useQuery<PostGraduationSummaryScheduledClassesResponse>({
    queryKey: [POST_GRADUATION_SUMMARY_SCHEDULED_CLASSES_QUERY_KEY, payload],
    queryFn: () => fetchPostGraduationSummaryScheduledClasses(payload),
    enabled: hasAno && hasBothDates,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
