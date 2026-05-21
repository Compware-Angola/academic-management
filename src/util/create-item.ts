interface TypeServiceResponse {
  codigo: number;
  preco: number;
  descricao: string;
  mesTempId: number;
  multa: number;
  valorDesconto: number;
}
export const createItem = (serviceType: TypeServiceResponse | null) => {
  if (!serviceType) return null;
  const MAX_OBS_LENGTH = 45;
  return {
    CodigoProduto: serviceType.codigo,
    Quantidade: 1,
    preco: serviceType.preco,
    Total: serviceType.preco,
    valor_pago: 0,
    obs: serviceType?.descricao?.substring(0, MAX_OBS_LENGTH) ?? "",
    taxaIva: 0,
    valorIva: 0,
    retencao: 0,
    incidencia: 0,
    valorDesconto: serviceType.valorDesconto,
    descontoProduto: serviceType.valorDesconto,
    mes: "",
    multa: serviceType.multa,
    mesTempId: serviceType.mesTempId,
    estado: 0,
    valorPago: 0,
    valorATransportar: 0,
  };
};

interface CreateInvoiceParams {
  poloid: number;
  codigoMatricula: number;
  totalApagar: number;
  total: number;
  itens?: any[];
  descricao?: string;
  codigoDescricao?: number;
  tipoDocumentoFacturaId?: number;
  canal?: number;
  totalMulta: number;
  totalDesconto: number;
}

export interface CreateInvoiceBody {
  polo_id: number;
  TotalPreco: number;
  codigo_descricao: number;
  ValorAPagar: number;
  total_incidencia: number;
  total_retencao: number;
  totalIVA: number;
  TotalMulta: number;
  Desconto: number;
  CodigoMatricula: number;
  codigo_preinscricao: number;
  Descricao: string;
  tipo_documento_factura_id: number;
  canal: number;
  DataFactura: string;
  itens: any[];
}

export const createInvoice = ({
  poloid,
  codigoMatricula,
  totalApagar,
  itens = [],
  descricao = "Matrícula + Inscrição em Disciplinas",
  codigoDescricao = 1111,
  tipoDocumentoFacturaId = 1,
  canal = 3,
  totalDesconto,
  totalMulta,
  total,
}: CreateInvoiceParams): CreateInvoiceBody => {
  return {
    polo_id: poloid,
    TotalPreco: total,
    codigo_descricao: codigoDescricao,
    ValorAPagar: totalApagar,
    total_incidencia: 0,
    total_retencao: 0,
    CodigoMatricula: codigoMatricula,
    codigo_preinscricao: null,
    Desconto: totalDesconto,
    totalIVA: 0,
    TotalMulta: totalMulta,
    Descricao: descricao.substring(0, 44),
    tipo_documento_factura_id: tipoDocumentoFacturaId,
    canal,
    DataFactura: new Date().toISOString(),
    itens,
  };
};
