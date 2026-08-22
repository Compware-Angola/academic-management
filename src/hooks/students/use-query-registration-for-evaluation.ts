import {
  GetRegistrationForEvaluationParams,
  GetRegistrationForEvaluationResponse,
  getRegistrationForEvaluationService,
} from "@/services/students/fetch-registration-for-evaluation";
import { useQuery } from "@tanstack/react-query";

export function useQueryRegistrationForEvaluation(
  params: GetRegistrationForEvaluationParams,
  enabled: boolean = true,
) {
  const {
    page,
    limit,
    codigoAnoLectivo,
    codigoMatricula,
    codigoCurso,
    codigoClasse,
    codigoSemestre,
    codigoDisciplina,
    estadoFactura,
    tipoAvaliacao,
    codigoGrade,
    search,
    codigoHorario,
  } = params;

  return useQuery<GetRegistrationForEvaluationResponse, Error>({
    queryKey: [
      "registration-for-evaluation",
      page,
      limit,
      codigoAnoLectivo,
      codigoMatricula,
      codigoCurso,
      codigoClasse,
      codigoSemestre,
      codigoDisciplina,
      estadoFactura,
      tipoAvaliacao,
      codigoGrade,
      search,
      codigoHorario,
    ],

    queryFn: () =>
      getRegistrationForEvaluationService({
        page,
        limit,
        codigoAnoLectivo,
        codigoMatricula,
        codigoCurso,
        codigoClasse,
        codigoSemestre,
        codigoDisciplina,
        estadoFactura,
        tipoAvaliacao,
        codigoGrade,
        search,
        codigoHorario,
      }),

    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
