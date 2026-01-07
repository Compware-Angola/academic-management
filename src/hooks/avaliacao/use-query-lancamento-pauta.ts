import {
  fetchLancamentosPauta,
  LancamentoPautaResponse,
} from "@/services/avaliacao/fetch-lancamento-pauta";
import { useQuery } from "@tanstack/react-query";

type Params = {
  anoLectivo?: number;
  tipoAvaliacao?: number;
  codigoGrade?: number;
  semestre?: number;
  anoCurricular?: number;
  curso?: number;
  page?: number;
  limit?: number;
  estadoPauta?: number;
};

export function useLancamentosPauta(params: Params) {
  return useQuery<LancamentoPautaResponse, Error>({
    queryKey: ["lancamentos-pauta", params],

    enabled: !!params.anoLectivo || !!params.tipoAvaliacao || !!params.curso,

    queryFn: () =>
      fetchLancamentosPauta({
        anoLectivo: params.anoLectivo,
        tipoAvaliacao: params.tipoAvaliacao,
        codigoGrade: params.codigoGrade,
        anoCurricular: params.anoCurricular,
        estadoPauta: params.estadoPauta,
        curso: params.curso,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      }),

    staleTime: 5 * 60 * 1000,
  });
}
