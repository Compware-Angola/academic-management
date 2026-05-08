import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { normalizeParam } from "@/util/normalize-param";

export type EstatisticasPagamentoPayload = {
  dataInicio: string;
  dataFim: string;
};

export type EstatisticasPagamentoResponse = {
  data: Array<Record<string, string | number>>;
};

export async function getEstatisticasPagamentoService(
  payload: EstatisticasPagamentoPayload,
): Promise<EstatisticasPagamentoResponse> {
  const params = {
    dataInicio: normalizeParam(payload.dataInicio),
    dataFim: normalizeParam(payload.dataFim),
  };

  const { data } = await axiosNestFinance.get<EstatisticasPagamentoResponse>(
    "/payment/estatisticas",
    { params },
  );

  return data;
}
