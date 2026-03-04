
import { AgendamentoAulaResponse, fetchAgendamentoAula, FiltroAgendamentoAulaPayload } from "@/services/sumario/fetch-sumario-agendamento-aula.service";
import { useQuery } from "@tanstack/react-query";

export const useQuerySumarioAgendamentoAula = (
  filters: FiltroAgendamentoAulaPayload & { page?: number; limit?: number }
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

  // Monta payload apenas com valores realmente úteis
  const payload: FiltroAgendamentoAulaPayload = {
    page,
    limit,
    ...(unidadeCurricular !== undefined && Number(unidadeCurricular) > 0 && { unidadeCurricular: Number(unidadeCurricular) }),
    ...(docente !== undefined && Number(docente) > 0 && { docente: Number(docente) }),
    ...(estado !== undefined && Number(estado) >= 1 && { estado: Number(estado) }),
    ...(hasAno && { anoLectivo: Number(anoLectivo) }),
    ...(semestre !== undefined && Number(semestre) > 0 && { semestre: Number(semestre) }),
    // Só inclui datas se ambas forem válidas
    ...(hasBothDates && { dataInicial, dataFinal }),
  };

  return useQuery<AgendamentoAulaResponse>({
    queryKey: ["sumario-agendamento-aula", payload],
    queryFn: () => fetchAgendamentoAula(payload),
    enabled,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};