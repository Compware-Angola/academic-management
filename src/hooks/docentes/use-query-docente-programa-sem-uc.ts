import {
  getListProgramasSemUCService,
  ListProgramasSemUCPayload,
  ListProgramasSemUCResponse,
} from "@/services/docentes/docente-programa-sem-uc.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryProgramasSemUC(payload: ListProgramasSemUCPayload) {
  const { anoLectivo, semestre, codigoCurso, anoCurricular, page, limit } =
    payload;
  const enabled =
    !!anoLectivo && !!semestre && !!codigoCurso && !!anoCurricular;

  return useQuery<ListProgramasSemUCResponse>({
    queryKey: [
      "programas-sem-ucs",
      anoLectivo,
      semestre,
      codigoCurso,
      anoCurricular,
      page,
      limit,
    ],
    enabled,
    queryFn: () => getListProgramasSemUCService(payload),
  });
}
