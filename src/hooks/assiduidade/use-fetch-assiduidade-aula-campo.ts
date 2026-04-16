import {
  FiltroAssiduidadePayload,
  FiltroAssiduidadeResponse,
  filtroAssiduidadeCampoService,
} from "@/services/assiduidade/fetch-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryFiltroAssiduidadeCampo = (
  filters: FiltroAssiduidadePayload,
  options?: { enabled?: boolean }
) => {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    periodoId,
    dataFinal,
    estado,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = filters;
  // ────────────────────────────────────────────────
  // Condição de ativação mais estrita e legível
  //────────────────────────────────────────────────
  const hasAno = anoLectivo !== undefined  && !isNaN(Number(anoLectivo));

  const hasBothDates =
    dataInicial !== undefined &&
    dataInicial !== "" &&
    dataFinal !== undefined &&
    dataFinal !== "" &&
    // Opcional: validar formato de data se quiseres ser mais rigoroso
    !isNaN(Date.parse(dataInicial)) &&
    !isNaN(Date.parse(dataFinal));

  const enabled = hasAno && hasBothDates;

  // Monta o payload somente com os campos definidos
  const payload: FiltroAssiduidadePayload = {
    ...(unidadeCurricular !== undefined && { unidadeCurricular }),
    ...(docente !== undefined && { docente }),
    ...(estado !== undefined && { estado }),
    ...(anoLectivo !== undefined && { anoLectivo }),
    ...(semestre !== undefined && { semestre }),
      ...(periodoId !== undefined && { periodoId }),
    page,
    limit,
    // só envia datas se ambas existirem
    ...(dataInicial && dataFinal && { dataInicial, dataFinal }),
  };

  return useQuery<FiltroAssiduidadeResponse>({
    queryKey: ["filtro-assiduidade-campo", payload],
    queryFn: () => filtroAssiduidadeCampoService(payload),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 20,   // 20 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};