import {
  ListEstudantesSemInscricaoCursoPayload,
  ListEstudantesSemInscricaoCursoResponse,
  getListEstudantesSemInscricaoCursoService,
} from "@/services/registrations/fetch-esudantes-sem-inscricoes-curso.service";
import { useQuery } from "@tanstack/react-query";

interface QueryEstudantesSemInscricaoCurso {
  enabled?: boolean;
}

export function useQueryListEstudantesSemInscricaoCurso(
  payload: ListEstudantesSemInscricaoCursoPayload,
  options?: QueryEstudantesSemInscricaoCurso,
) {
  const { codigoAnoLectivo, codigoCurso, codigoMatricula, nome, page, limit } =
    payload;

  const defaultEnabled = !!codigoAnoLectivo && !!codigoCurso;

  return useQuery<ListEstudantesSemInscricaoCursoResponse>({
    queryKey: [
      "estudantes-sem-inscricao-curso",
      codigoAnoLectivo,
      codigoCurso,
      codigoMatricula,
      nome,
      page,
      limit,
    ],
    queryFn: () => getListEstudantesSemInscricaoCursoService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
