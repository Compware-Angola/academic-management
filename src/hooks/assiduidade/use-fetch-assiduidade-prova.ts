import {
  ProvaAssiduidadePayload,
  ProvaAssiduidadeResponse,
  provaAssiduidadeService,
} from "@/services/assiduidade/fetch-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryProvaAssiduidade = (
  filters: ProvaAssiduidadePayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    docente,
    disciplina,
    dataInicio,
    dataFim,
    estado,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<ProvaAssiduidadeResponse>({
    queryKey: [
      "prova-assiduidade",
      {
        docente,
        disciplina,
        dataInicio,
        dataFim,
        estado,
        anoLectivo,
        semestre,
        page,
        limit,
      },
    ],
    queryFn: () => provaAssiduidadeService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};