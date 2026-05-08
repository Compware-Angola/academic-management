import { axiosNestFinance } from "@/lib/axios-nest-finance";

/**
 * Payload para criação de pagamento
 */
export interface CreatePaymentPayload {
  data: string;
  nOperacaoBancaria: number;
  observacao?: string;
  dataBanco: string;
  formaPagamento: string;
  valorDepositado: number;
  contaMovimentada: number;
  dataRegisto: string;
  canal: number;
  nomeDocumento?: string;
  nomeDocumento2?: string;
  estado: number;
  tipoPagamento: string;
  codigoFactura: number;
  instituicaoId: number;
  caixaId: number;
  dataOperacao: string;
  statusMovimento: number;
  infoAdicional?: string;
  corrente: number;
  anoLectivo: number;
  feitoComReserva?: string;
}

export async function createPayment(payload: CreatePaymentPayload) {
  const response = await axiosNestFinance.post("/payment/create", payload);
  return response.data;
}
