import {
  getListAfectacaoDocentesService,
  ListAfectacaoDocentesPayload,
  ListAfectacaoDocentesResponse,
} from "@/services/gestao-docente/fetch-afectacao.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryAfectacaoDocentes(
  payload: ListAfectacaoDocentesPayload,
) {
  const {
    anoLectivo,
    semestre,
    unidadeCurricular,
    curso,
    anoCurricular,
    docente,
    page,
    limit,
  } = payload;

  const enabled = !!anoLectivo;

  return useQuery<ListAfectacaoDocentesResponse>({
    queryKey: [
      "docentes-afectacao",
      anoLectivo,
      semestre,
      unidadeCurricular,
      curso,
      anoCurricular,
      docente,
      page,
      limit,
    ],
    enabled,
    queryFn: () => getListAfectacaoDocentesService(payload),
  });
}
