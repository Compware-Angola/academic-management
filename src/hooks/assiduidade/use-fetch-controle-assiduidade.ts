import {
  AgendamentosDocentePayload,
  AgendamentosDocenteResponse,
  controleAssiduidadeService,
} from "@/services/assiduidade/controle-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryControleAssiduidade = (
  filters: AgendamentosDocentePayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    docente,
    dataInicial,
    dataFinal,
    estado,
    anoLectivo,
    semestre,
    gradeCurricular,
    search,
    page = 1,
    limit = 20,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<AgendamentosDocenteResponse>({
    queryKey: [
      "agendamentos-docente",
      {
        docente,
        dataInicial,
        dataFinal,
        estado,
        anoLectivo,
        semestre,
        gradeCurricular,
        search,
        page,
        limit,
      },
    ],
    queryFn: () => controleAssiduidadeService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};