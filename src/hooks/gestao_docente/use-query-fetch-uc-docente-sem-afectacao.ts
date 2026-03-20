import { useQuery } from "@tanstack/react-query";

import {
  UCDocenteSemAfectacaoPayload,
  UCDocenteSemAfectacaoResponse,
  fetchUCDocenteSemAfectacaoService,
} from "@/services/gestao-docente/fetch-uc-docente-sem-afectacao.service";

export function useQueryUCDocenteSemAfectacao(
  payload: UCDocenteSemAfectacaoPayload,
) {
  const {
    anoLectivoId,
    cursoId,
    semestreId,
    classeId,
    page,
    limit,
    search,
  } = payload;



  return useQuery<UCDocenteSemAfectacaoResponse>({
    queryKey: [
      "uc-docente-sem-afectacao",
      anoLectivoId,
      cursoId,
      semestreId,
      classeId,
      page,
      limit,
      search,
    ],
    queryFn: () => fetchUCDocenteSemAfectacaoService(payload),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
