import { ControleResponse, fetchControloGeralAssiduidade, FiltroControleGeralPayload } from "@/services/sumario/fetch-controlo-geral-sumario.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryControloGeralAssiduidade = (
  filters: FiltroControleGeralPayload & { page?: number; limit?: number }
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
  const hasAno = anoLectivo !== undefined && !isNaN(Number(anoLectivo));

  const hasBothDates =
    dataInicial !== undefined &&
    dataInicial !== "" &&
    dataFinal !== undefined &&
    dataFinal !== "" &&
    !isNaN(Date.parse(dataInicial)) &&
    !isNaN(Date.parse(dataFinal));

  const enabled = hasAno && hasBothDates;

  // Monta payload apenas com valores realmente úteis
  const payload: FiltroControleGeralPayload = {
    page,
    limit,
    ...(unidadeCurricular !== undefined && Number(unidadeCurricular) > 0 && { unidadeCurricular: Number(unidadeCurricular) }),
    ...(docente !== undefined && Number(docente) > 0 && { docente: Number(docente) }),
    ...(estado !== undefined && Number(estado) >= 1 && { estado: Number(estado) }),
    ...(hasAno && { anoLectivo: Number(anoLectivo) }),
    ...(semestre !== undefined && Number(semestre) > 0 && { semestre: Number(semestre) }),
    ...(hasBothDates && { dataInicial, dataFinal }),
  };

  return useQuery<ControleResponse>({
    queryKey: ["controlo-geral-assiduidade", payload],
    queryFn: () => fetchControloGeralAssiduidade(payload),
    enabled,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};