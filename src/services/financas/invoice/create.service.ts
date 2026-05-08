import { axiosNestFinance } from "@/lib/axios-nest-finance";

// -------------------- TIPOS --------------------

export type InvoiceItemPayload = {
  CodigoProduto: number;
  Quantidade: number;
  preco: number;
  Total: number;
  valor_pago: number;
  obs?: string;
  taxaIva: number;
  valorIva: number;
  retencao?: number;
  incidencia?: number;
  valorDesconto?: number;
  descontoProduto?: number;
  mes?: string;
  multa?: number;
  mesTempId?: number;
  estado?: number;
  valorPago?: number;
  valorATransportar?: number;
  codigoFactura?: number;
  codigo_anoLectivo?: number;
};

export type InvoicePayload = {
  DataFactura: string;
  polo_id: number;
  TotalPreco: number;
  codigo_descricao?: number;
  ValorAPagar: number;
  total_incidencia: number;
  total_retencao: number;
  CodigoMatricula?: number;
  codigo_preinscricao?: number;
  Desconto: number;
  totalIVA: number;
  TotalMulta: number;
  Descricao: string;
  tipo_documento_factura_id: number;
  canal: number;
  codigo_anoLectivo?: number;
  itens: InvoiceItemPayload[];
};

// -------------------- UPDATE PAYLOAD --------------------
export type UpdateInvoicePayload = {
  DataFactura?: string;
  polo_id?: number;
  TotalPreco?: number;
  ValorAPagar?: number;
  Desconto?: number;
  Descricao?: string;
  canal?: number;
  estado?: number;
  // Adicione outros campos que possam ser atualizados conforme necessário
};

// -------------------- RESPONSE --------------------
export type InvoiceResponse = {
  sucesso: number;
  mensagem: string;
};

// -------------------- CREATE --------------------
export async function createInvoiceService(
  payload: InvoicePayload,
): Promise<InvoiceResponse> {
  const { data } = await axiosNestFinance.post("/invoices", payload);
  return data;
}
