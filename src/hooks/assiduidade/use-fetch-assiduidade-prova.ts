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
    periodoId,
    dataFim,
    estado,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = filters;
  const hasAno = anoLectivo !== undefined  && !isNaN(Number(anoLectivo));

  const hasBothDates =
    dataInicio !== undefined &&
    dataInicio !== "" &&
    dataFim !== undefined &&
    dataFim !== "" &&
    // Opcional: validar formato de data se quiseres ser mais rigoroso
    !isNaN(Date.parse(dataInicio)) &&
    !isNaN(Date.parse(dataFim));

  const enabled = hasAno && hasBothDates;

  // Monta o payload somente com os campos definidos
  const payload: ProvaAssiduidadePayload = {
    ...(docente !== undefined && { docente }),
    ...(disciplina !== undefined && { disciplina }),
    ...(periodoId !== undefined && { periodoId }),
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