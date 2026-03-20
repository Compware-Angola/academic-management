import {
  getListGestaoAfectacaoDocentesService,
  ListGestaoAfectacaoDocentesPayload,
  ListGestaoAfectacaoDocentesResponse,
} from "@/services/gestao-docente/fetch-gestao-afectacao.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryGestaoAfectacaoDocentes(
  payload: ListGestaoAfectacaoDocentesPayload,
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

  return useQuery<ListGestaoAfectacaoDocentesResponse>({
    queryKey: [
      "gestao-docentes-afectacao",
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
    queryFn: () => getListGestaoAfectacaoDocentesService(payload),
  });
}
