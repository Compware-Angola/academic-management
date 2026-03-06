import { useQuery } from "@tanstack/react-query";
import { fetchSumario, FiltroSumarioPayload, SumarioResponse } from "@/services/sumario/fetch-sumario.service";

export const useQuerySumario = (
  filters: FiltroSumarioPayload & { page?: number; limit?: number }
) => {
  const {
    unidadeCurricular,
    docente,
    dataInicial,
    dataFinal,
    estado_sumario,
    anoLectivo,
    semestre,
    page = 1,
    limit = 20,
  } = filters;

  // ────────────────────────────────────────────────
  // Condição de ativação mais estrita e legível
  //────────────────────────────────────────────────
  const hasAno = anoLectivo !== undefined && !isNaN(Number(anoLectivo));

  const hasBothDates =
    dataInicial !== undefined &&
    dataInicial !== "" &&
    dataFinal !== undefined &&
    dataFinal !== "" &&
    !isNaN(Date.parse(dataInicial)) &&
    !isNaN(Date.parse(dataFinal));

  //const enabled = hasAno && hasBothDates;
  const enabled = hasAno 

  // Monta payload apenas com valores realmente úteis
  const payload: FiltroSumarioPayload = {
    page,
    limit,
    ...(unidadeCurricular !== undefined && Number(unidadeCurricular) > 0 && { unidadeCurricular: Number(unidadeCurricular) }),
    ...(docente !== undefined && Number(docente) > 0 && { docente: Number(docente) }),
    ...(estado_sumario !== undefined && Number(estado_sumario) >= 1 && { estado_sumario: Number(estado_sumario) }),
    ...(hasAno && { anoLectivo: Number(anoLectivo) }),
    ...(semestre !== undefined && Number(semestre) > 0 && { semestre: Number(semestre) }),
    ...(hasBothDates && { dataInicial, dataFinal }),
  };

  return useQuery<SumarioResponse>({
    queryKey: ["sumario", payload],
    queryFn: () => fetchSumario(payload),
    enabled,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};