import {
  FiltroAssiduidadePayload,
  FiltroAssiduidadeResponse,
  filtroAssiduidadeService,
} from "@/services/assiduidade/fetch-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryFiltroAssiduidade = (
  filters: FiltroAssiduidadePayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<FiltroAssiduidadeResponse>({
    queryKey: [
      "filtro-assiduidade",
      {
        unidadeCurricular,
        docente,
        dataInicial,
        dataFinal,
        estado,
        anoLectivo,
        semestre,
        page,
        limit,
      },
    ],
    queryFn: () => filtroAssiduidadeService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};