import {
  getListProgramaUCService,
  ListProgramaUCPayload,
  ListProgramaUCResponse,
} from "@/services/docentes/docente-programa-uc.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryDocenteListProgramaUC(payload: ListProgramaUCPayload) {
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
  const enabled =
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
    enabled,
  });
}
