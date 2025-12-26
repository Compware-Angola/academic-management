import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AtualizarEstadoPautaPayload = {
  codigo: number;
  fkEstadoLancamentoPauta: 2 | 3; // 2 = Aprovado, 3 = Rejeitado
};

export type AtualizarEstadoPautaResponse = {
  success: boolean;
  message: string;
};

/**
 * Atualiza o estado de uma pauta (aprovar ou rejeitar)
 */
export async function atualizarEstadoPauta(
  payload: AtualizarEstadoPautaPayload
): Promise<AtualizarEstadoPautaResponse> {
  const { codigo, fkEstadoLancamentoPauta } = payload;

  const { data } = await axiosNestGa.patch<AtualizarEstadoPautaResponse>(
    `assessment/lancamento-pauta/${codigo}/estado`,
    { fkEstadoLancamentoPauta }
  );

  return data;
}