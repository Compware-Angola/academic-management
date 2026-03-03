import {
  ProvaAssiduidadePayload,
  ProvaAssiduidadeResponse,
  provaAssiduidadeService,
} from "@/services/assiduidade/fetch-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryProvaAssiduidade = (
  filters: ProvaAssiduidadePayload,
  options?: { enabled?: boolean }
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

  // Monta o payload somente com os campos definidos
  const payload: ProvaAssiduidadePayload = {
    ...(docente !== undefined && { docente }),
    ...(disciplina !== undefined && { disciplina }),
    ...(estado !== undefined && { estado }),
    ...(anoLectivo !== undefined && { anoLectivo }),
    ...(semestre !== undefined && { semestre }),
    page,
    limit,
    // só envia datas se ambas existirem
    ...(dataInicio && dataFim && { dataInicio, dataFim }),
  };

  return useQuery<ProvaAssiduidadeResponse>({
    queryKey: ["prova-assiduidade", payload],
    queryFn: () => provaAssiduidadeService(payload),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 20,   // 20 min
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};