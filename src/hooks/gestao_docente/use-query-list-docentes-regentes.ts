// src/hooks/acess/use-query-list-docentes-regentes.ts

import { ListDocentesRegentesParams, listDocentesRegentesService } from "@/services/gestao-docente/list-docentes-regentes.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryListDocentesRegentes(
  params: ListDocentesRegentesParams
) {
  const {
    page = 1,
    limit = 25,
    ano_lectivo,
    curso,
    classe,
    semestre,
    estado = 0,
    search,
  } = params;

  return useQuery({
    queryKey: [
      "docentes-regentes",
      page,
      limit,
      ano_lectivo,
      curso,
      classe,
      semestre,
      estado,
      search,
    ],
    queryFn: () =>
      listDocentesRegentesService({
        page,
        limit,
        ano_lectivo,
        curso,
        classe,
        semestre,
        estado,
        search,
      }),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}