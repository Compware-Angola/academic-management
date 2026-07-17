import {
  FiltroAssiduidadePayload,
  FiltroAssiduidadeResponse,
  filtroAssiduidadeService,
} from "@/services/assiduidade/fetch-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryFiltroAssiduidade = (
  filters: FiltroAssiduidadePayload & { page?: number; limit?: number },
  options?: { enabled?: boolean },
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

  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled && hasAno && hasBothDates
      : hasAno && hasBothDates;

  // Monta payload apenas com valores realmente úteis
  const payload: FiltroAssiduidadePayload = {
    page,
    limit,
    ...(unidadeCurricular !== undefined && Number(unidadeCurricular) > 0 && { unidadeCurricular: Number(unidadeCurricular) }),
    ...(docente !== undefined && Number(docente) > 0 && { docente: Number(docente) }),
    ...(estado !== undefined && Number(estado) >= 1 && { estado: Number(estado) }),
    ...(hasAno && { anoLectivo: Number(anoLectivo) }),
    ...(semestre !== undefined && Number(semestre) > 0 && { semestre: Number(semestre) }),
      ...(periodoId !== undefined && Number(periodoId) > 0 && { periodoId: Number(periodoId) }),
    // Só inclui datas se ambas forem válidas
    ...(hasBothDates && { dataInicial, dataFinal }),
  };

  return useQuery<FiltroAssiduidadeResponse>({
    queryKey: ["filtro-assiduidade", payload],
    queryFn: () => filtroAssiduidadeService(payload),
    enabled,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
