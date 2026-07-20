import { useQuery } from "@tanstack/react-query";

import {
  fetchPostGraduationSummaries,
  PostGraduationSummariesParams,
  PostGraduationSummariesResponse,
} from "@/services/post-graduation/summaries.service";

export const POST_GRADUATION_SUMMARIES_QUERY_KEY =
  "post-graduation-summaries";

export function useQueryPostGraduationSummaries(
  filters: PostGraduationSummariesParams,
) {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado_sumario,
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

  const payload: PostGraduationSummariesParams = {
    page,
    limit,
    ...(unidadeCurricular !== undefined &&
      Number(unidadeCurricular) > 0 && {
        unidadeCurricular: Number(unidadeCurricular),
      }),
    ...(docente !== undefined &&
      Number(docente) > 0 && { docente: Number(docente) }),
    ...(estado_sumario !== undefined &&
      Number(estado_sumario) >= 1 && {
        estado_sumario: Number(estado_sumario),
      }),
    ...(hasAno && { anoLectivo: Number(anoLectivo) }),
    ...(semestre !== undefined &&
      Number(semestre) > 0 && { semestre: Number(semestre) }),
    ...(degreeId !== undefined &&
      [2, 3].includes(Number(degreeId)) && { degreeId: Number(degreeId) }),
    ...(hasBothDates && { dataInicial, dataFinal }),
  };

  return useQuery<PostGraduationSummariesResponse>({
    queryKey: [POST_GRADUATION_SUMMARIES_QUERY_KEY, payload],
    queryFn: () => fetchPostGraduationSummaries(payload),
    enabled: hasAno,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
