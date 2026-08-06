import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface DebtNegotiationConciliationItem {
  codigo: number;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  valor_total: number;
  mes_designacao: string;
}

export interface DebtNegotiationInvoiceconciliation {
  codigo: number;
  data: string;
  total_preco: number;
  valor_apagar: number;
  valor_entregue: number;
  desconto: number;
  total_iva: number;
  total_multa: number;
  total_incidencia: number;
  total_retencao: number;
  valor_apagar_extenso: string | null;
  descricao: string;
  referencia: string;
  data_vencimento: string;
  estado: number;
  ano_lectivo: number;
  itens: DebtNegotiationConciliationItem[];
}

export interface DebtNegotiationDetailsConciliation {
  id: number;
  codigo_matricula: number;
  nome: string;
  curso: string;
  valor_divida: number;
  prestacoes: number;
  data_criacao: string;
  mes_inicial: string | null;
  mes_final: string | null;
  primeiro_valor_pagar: number;
  valor_prestacao: number;
  valor_restante: number;
  codigo_factura: number;
  ano_lectivo: number;
  tipo_negociacao_id: number;
  faculdade_id: number;
  faculdade: string;
  facturas: DebtNegotiationInvoiceconciliation[];
  esta_na_negociacao: boolean;
}

export const getDebtNegotiationDetailsConciliation = async (
  id: number,
): Promise<DebtNegotiationDetailsConciliation> => {
  const { data } =
    await axiosNestFinance.get<DebtNegotiationDetailsConciliation>(
      `/debt-negotiation/details/${id}`,
    );

  return data;
};

//Create Negotiation Conciliation

export interface ConciliacaoDividaItemPayload {
  InvoiceItemId: number;
  valor: number;
}

export interface ConciliacaoDividaInvoicePayload {
  invoiceId: number;
  itens: ConciliacaoDividaItemPayload[];
}

export interface CreateConciliacaoDividaPayload {
  descricao: string;
  invoices: ConciliacaoDividaInvoicePayload[];
}

export type ConciliacaoStatus = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface CreateConciliacaoDividaSuccessItem {
  id: number;
  facturaOriginal: {
    Codigo: number;
  };
  facturaPropostaAlteracao: {
    Codigo: number;
  };
  descricaoCriacao: string;
  descricaoValidacao: string | null;
  status: ConciliacaoStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  validatedBy: number | null;
  validatedAt: string | null;
}

export type CreateConciliacaoDividaResponse =
  CreateConciliacaoDividaSuccessItem[];

export interface CreateConciliacaoDividaErrorItem {
  invoiceId: number;
  mensagem: string;
}

export interface CreateConciliacaoDividaErrorResponse {
  message: string;
  errors: CreateConciliacaoDividaErrorItem[];
}

export const createConciliacaoDivida = async (
  payload: CreateConciliacaoDividaPayload,
): Promise<CreateConciliacaoDividaResponse> => {
  const { data } = await axiosNestFinance.post<CreateConciliacaoDividaResponse>(
    "/conciliacao-dividas",
    payload,
  );

  return data;
};
// Listar Conciliação
