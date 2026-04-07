import {
  ListEstudantesMatriculadosPayload,
  ListEstudantesMatriculadosResponse,
  getListEstudantesMatriculadosService,
} from "@/services/registrations/fetch-estudantes-matriculados.service";

import { useQuery } from "@tanstack/react-query";

interface QueryEstudantesMatriculados {
  enabled?: boolean;
}

export function useQueryListEstudantesMatriculados(
  payload: ListEstudantesMatriculadosPayload,
  options?: QueryEstudantesMatriculados,
) {
  const {
    codigoAnoLectivo,
    codigoCurso,
    periodo,
    anoCurricular,
    tipoEstudante,
    page,
    limit,
  } = payload;

  const defaultEnabled = !!codigoAnoLectivo && !!codigoCurso;

  return useQuery<ListEstudantesMatriculadosResponse>({
    queryKey: [
      "estudantes-matriculados",
      codigoAnoLectivo,
      codigoCurso,
      periodo,
      anoCurricular,
      tipoEstudante,
      page,
      limit,
    ],
    queryFn: () => getListEstudantesMatriculadosService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
