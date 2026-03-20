import {
  getListProgramaUCService,
  ListProgramaUCPayload,
  ListProgramaUCResponse,
} from "@/services/docentes/docente-programa-uc.service";
import { useQuery } from "@tanstack/react-query";

interface QUeryDocenteProgramaUC {
  enabled: boolean;
}
export function useQueryDocenteListProgramaUC(
  payload: ListProgramaUCPayload,
  options?: QUeryDocenteProgramaUC,
) {
  const {
    anoCurricular,
    anoLectivo,
    codigoCurso,
    semestre,
    unidadeCurricular,
    estado,
    limit,
    page,
  } = payload;

  const defaultEnabled =
    !!anoCurricular && !!anoLectivo && !!codigoCurso && !!semestre;
  return useQuery<ListProgramaUCResponse>({
    queryKey: [
      "programa-uc",
      anoCurricular,
      anoLectivo,
      codigoCurso,
      unidadeCurricular,
      semestre,
      estado,
      limit,
      page,
    ],
    queryFn: () => getListProgramaUCService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
