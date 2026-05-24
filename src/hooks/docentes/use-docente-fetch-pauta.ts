import {
  DocentePautaResponse,
  fetchDocenteLancamentosPauta,
  FilterDocentePautaParams,
} from "@/services/docentes/docente-lancamento-pauta.service";
import { useQuery } from "@tanstack/react-query";

export function useDocenteFetchPauta(
  params: Partial<FilterDocentePautaParams>,
) {
  const {
    anoLectivo,
    semestre,
    codigoCurso,
    docenteId,
    anoCurricular,
    limit,
    page,
  } = params;

  return useQuery<DocentePautaResponse, Error>({
    queryKey: ["docente-fetch-pauta", params],
    queryFn: () =>
      fetchDocenteLancamentosPauta({
        anoLectivo,
        semestre,
        codigoCurso,
        docenteId,
        anoCurricular,
        limit,
        page,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: !!anoLectivo && !!semestre && !!codigoCurso && !!anoCurricular,
  });
}
