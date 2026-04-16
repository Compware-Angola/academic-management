import {
  ListDocentesAfectacaoPayload,
  ListDocentesAfectacaoResponse,
  getListDocentesAfectacaoService,
} from "@/services/gestao-docente/fetch-docente-afectacao.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryDocentesAfectacao(
  payload: ListDocentesAfectacaoPayload,
) {
  const {
    anoLectivo,
    tipoAfectacao,
    semestre,
    docente,
    search,
    dataInicial,
    dataFinal,
    page,
    limit,
  } = payload;

  const enabled = !!anoLectivo && !!tipoAfectacao;

  return useQuery<ListDocentesAfectacaoResponse>({
    queryKey: [
      "docentes-afectacao",
      anoLectivo,
      tipoAfectacao,
      semestre,
      docente,
      dataInicial,
      dataFinal,
      search,
      page,
      limit,
    ],
    enabled,
    queryFn: () => getListDocentesAfectacaoService(payload),
  });
}
