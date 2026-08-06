// import { axiosNestFinance } from "@/lib/axios-nest-finance";

// export type ConciliacaoDividaStatus = "PENDENTE" | "APROVADO" | "REJEITADO";

// export interface ConciliacaoDividaFilters {
//   page?: number;
//   limit?: number;
//   status?: ConciliacaoDividaStatus;
//   facturaOriginalId?: number;
//   facturaPropostaId?: number;
//   createdBy?: number;
//   codigoAnoLectivo?: number;
//   codigoCurso?: number;
//   codigoMatricula?: number;
//   nome?: string;
// }

// export interface ConciliacaoFactura {
//   codigo: number;
//   descricao: string;
//   referencia: string;
//   estado: number;
//   totalPreco: number;
//   valorApagar: number;
//   data: string;
//   anoLectivo?: number;
// }

// export interface ConciliacaoEstudante {
//   codigoMatricula: number | null;
//   nome: string | null;
//   codigoCurso: number | null;
//   curso: string | null;
//   faculdade: string | null;
// }

// export interface ConciliacaoDivida {
//   id: number;
//   status: ConciliacaoDividaStatus;
//   descricaoCriacao: string;
//   descricaoValidacao: string | null;
//   createdAt: string;
//   updatedAt: string;
//   createdBy: number;
//   validatedBy: number | null;
//   validatedAt: string | null;

//   facturaOriginal: ConciliacaoFactura;

//   facturaPropostaAlteracao: ConciliacaoFactura;

//   estudante: ConciliacaoEstudante;
// }

// export interface ConciliacaoDividasResponse {
//   data: ConciliacaoDivida[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export const getConciliacaoDividas = async (
//   filters: ConciliacaoDividaFilters = {},
// ): Promise<ConciliacaoDividasResponse> => {
//   const { data } = await axiosNestFinance.get<ConciliacaoDividasResponse>(
//     "/conciliacao-dividas",
//     {
//       params: filters,
//     },
//   );

//   return data;
// };

// //==================================================== GET BY ID =============================================

// export interface ConciliationInvoiceItem {
//   codigo: number;
//   descricao: string;
//   quantidade: number;
//   preco_unitario: number;
//   valor_total: number;
//   mes_designacao: string | null;
// }

// export interface ConciliationInvoice {
//   codigo: number;
//   descricao: string;
//   referencia: string;
//   estado: number;
//   totalPreco: number;
//   valorApagar: number;
//   data: string;
//   anoLectivo?: number;
//   itens: ConciliationInvoiceItem[];
// }

// export interface ConciliationStudent {
//   codigoMatricula: number | null;
//   nome: string | null;
//   codigoCurso: number | null;
//   curso: string | null;
//   faculdade: string | null;
// }

// export interface ConciliationDetails {
//   id: number;
//   status: "PENDENTE" | "APROVADO" | "REJEITADO";
//   descricaoCriacao: string;
//   descricaoValidacao: string | null;
//   createdAt: string;
//   updatedAt: string;
//   createdBy: number;
//   validatedBy: number | null;
//   validatedAt: string | null;

//   facturaOriginal: ConciliationInvoice;
//   facturaPropostaAlteracao: ConciliationInvoice;

//   estudante: ConciliationStudent;
// }

// interface RawConciliationInvoiceItem {
//   codigo: number;
//   CodigoProduto: number;
//   CodigoFactura: number;
//   quantidade: number;
//   total: number;
//   obs: string | null;
//   preco: number;
//   mes: string | null;
//   estado: number;
//   [key: string]: unknown;
// }

// interface RawConciliationInvoice {
//   Codigo: number;
//   Descricao: string | null;
//   DataFactura: string;
//   TotalPreco: number;
//   valorApagar: number;
//   Referencia: string;
//   estado: number;
//   anoLectivo?: number;
//   itens: RawConciliationInvoiceItem[];
//   [key: string]: unknown;
// }

// interface RawConciliationStudent {
//   codigoMatricula?: number | null;
//   nome?: string | null;
//   codigoCurso?: number | null;
//   curso?: string | null;
//   faculdade?: string | null;
// }

// interface RawConciliationDetails {
//   id: number;
//   status: "PENDENTE" | "APROVADO" | "REJEITADO";
//   descricaoCriacao: string | null;
//   descricaoValidacao: string | null;
//   createdAt: string;
//   updatedAt: string;
//   createdBy: number;
//   validatedBy: number | null;
//   validatedAt: string | null;
//   facturaOriginal: RawConciliationInvoice;
//   facturaPropostaAlteracao: RawConciliationInvoice;
//   // Actualmente o endpoint NÃO devolve isto — ver nota no fim do ficheiro.
//   estudante?: RawConciliationStudent | null;
// }

// /* ──────────────────────────────────────────────────────────
//  * Mapeamento raw -> shape usado pelos componentes
//  * ────────────────────────────────────────────────────────── */
// function mapItem(raw: RawConciliationInvoiceItem): ConciliationInvoiceItem {
//   return {
//     codigo: raw.codigo,
//     descricao: raw.obs ?? "Sem descrição",
//     quantidade: raw.quantidade,
//     preco_unitario: raw.preco,
//     valor_total: raw.total,
//     mes_designacao: raw.mes,
//   };
// }

// function mapInvoice(raw: RawConciliationInvoice): ConciliationInvoice {
//   return {
//     codigo: raw.Codigo,
//     descricao: raw.Descricao ?? "",
//     referencia: raw.Referencia,
//     estado: raw.estado,
//     totalPreco: raw.TotalPreco,
//     valorApagar: raw.valorApagar,
//     data: raw.DataFactura,
//     anoLectivo: raw.anoLectivo,
//     itens: (raw.itens ?? []).map(mapItem),
//   };
// }

// function mapStudent(
//   raw: RawConciliationStudent | null | undefined,
// ): ConciliationStudent {
//   return {
//     codigoMatricula: raw?.codigoMatricula ?? null,
//     nome: raw?.nome ?? null,
//     codigoCurso: raw?.codigoCurso ?? null,
//     curso: raw?.curso ?? null,
//     faculdade: raw?.faculdade ?? null,
//   };
// }

// function mapConciliationDetails(
//   raw: RawConciliationDetails,
// ): ConciliationDetails {
//   return {
//     id: raw.id,
//     status: raw.status,
//     descricaoCriacao: raw.descricaoCriacao ?? "",
//     descricaoValidacao: raw.descricaoValidacao,
//     createdAt: raw.createdAt,
//     updatedAt: raw.updatedAt,
//     createdBy: raw.createdBy,
//     validatedBy: raw.validatedBy,
//     validatedAt: raw.validatedAt,
//     facturaOriginal: mapInvoice(raw.facturaOriginal),
//     facturaPropostaAlteracao: mapInvoice(raw.facturaPropostaAlteracao),
//     estudante: mapStudent(raw.estudante),
//   };
// }

// /* ──────────────────────────────────────────────────────────
//  * Chamada à API
//  * ────────────────────────────────────────────────────────── */
// export const getConciliationDetails = async (
//   id: number,
// ): Promise<ConciliationDetails> => {
//   const { data } = await axiosNestFinance.get<RawConciliationDetails>(
//     `/conciliacao-dividas/${id}`,
//   );

//   return mapConciliationDetails(data);
// };

import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ConciliacaoDividaStatus = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface ConciliacaoDividaFilters {
  page?: number;
  limit?: number;
  status?: ConciliacaoDividaStatus;
  facturaOriginalId?: number;
  facturaPropostaId?: number;
  createdBy?: number;
  codigoAnoLectivo?: number;
  codigoCurso?: number;
  codigoMatricula?: number;
  nome?: string;
}

export interface ConciliacaoFactura {
  codigo: number;
  descricao: string;
  referencia: string;
  estado: number;
  totalPreco: number;
  valorApagar: number;
  data: string;
  anoLectivo?: number;
}

export interface ConciliacaoEstudante {
  codigoMatricula: number | null;
  nome: string | null;
  codigoCurso: number | null;
  curso: string | null;
  faculdade: string | null;
}

export interface ConciliacaoDivida {
  id: number;
  status: ConciliacaoDividaStatus;
  descricaoCriacao: string;
  descricaoValidacao: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  validatedBy: number | null;
  validatedAt: string | null;

  facturaOriginal: ConciliacaoFactura;
  facturaPropostaAlteracao: ConciliacaoFactura;
  estudante: ConciliacaoEstudante;
}

export interface ConciliacaoDividasResponse {
  data: ConciliacaoDivida[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getConciliacaoDividas = async (
  filters: ConciliacaoDividaFilters = {},
): Promise<ConciliacaoDividasResponse> => {
  const { data } = await axiosNestFinance.get<ConciliacaoDividasResponse>(
    "/conciliacao-dividas",
    {
      params: filters,
    },
  );

  return data;
};

//==================================================== GET BY ID =============================================

export interface ConciliationInvoiceItem {
  codigo: number;
  codigoProduto: number;
  codigoFactura: number;

  quantidade: number;
  preco: number;
  total: number;

  descricao: string | null;
  mes: string | null;

  taxaIva: number;
  valorIva: number;
  retencao: number;
  incidencia: number;
  valorDesconto: number;
  descontoProduto: number;
  multa: number;

  mesTempId: number | null;
  codigoAnoLectivo: number | null;

  valorPago: number;
  valorATransportar: number;

  estado: number;
}

export interface ConciliationInvoice {
  codigo: number;
  descricao: string;
  referencia: string;
  estado: number;
  totalPreco: number;
  valorApagar: number;
  data: string;
  anoLectivo?: number;
  itens: ConciliationInvoiceItem[];
}

export interface ConciliationStudent {
  codigoMatricula: number | null;
  nome: string | null;
  codigoCurso: number | null;
  curso: string | null;
  faculdade: string | null;
}

export interface ConciliationDetails {
  id: number;
  status: ConciliacaoDividaStatus;
  descricaoCriacao: string;
  descricaoValidacao: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  validatedBy: number | null;
  validatedAt: string | null;

  facturaOriginal: ConciliationInvoice;
  facturaPropostaAlteracao: ConciliationInvoice;
  estudante: ConciliationStudent;
}

interface RawConciliationInvoiceItem {
  codigo: number;
  CodigoProduto: number;
  CodigoFactura: number;

  quantidade: number;
  preco: number;
  total: number;

  obs: string | null;
  mes: string | null;

  taxaIva: number;
  valorIva: number;
  retencao: number;
  incidencia: number;
  valorDesconto: number;
  descontoProduto: number;
  multa: number;

  mesTempId: number | null;
  codigoAnoLectivo: number | null;

  valorPago: number;
  valorATransportar: number;

  estado: number;

  [key: string]: unknown;
}

interface RawConciliationInvoice {
  codigo: number;
  descricao: string | null;
  referencia: string;
  estado: number;
  totalPreco: number;
  valorApagar: number;
  data: string;
  anoLectivo?: number;

  itens: RawConciliationInvoiceItem[];

  [key: string]: unknown;
}

interface RawConciliationStudent {
  codigoMatricula?: number | null;
  nome?: string | null;
  codigoCurso?: number | null;
  curso?: string | null;
  faculdade?: string | null;
}

interface RawConciliationDetails {
  id: number;
  status: ConciliacaoDividaStatus;
  descricaoCriacao: string | null;
  descricaoValidacao: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  validatedBy: number | null;
  validatedAt: string | null;

  facturaOriginal: RawConciliationInvoice;
  facturaPropostaAlteracao: RawConciliationInvoice;

  estudante?: RawConciliationStudent | null;
}

function mapItem(raw: RawConciliationInvoiceItem): ConciliationInvoiceItem {
  return {
    codigo: raw.codigo,
    codigoProduto: raw.CodigoProduto,
    codigoFactura: raw.CodigoFactura,

    quantidade: raw.quantidade,
    preco: raw.preco,
    total: raw.total,

    descricao: raw.obs,
    mes: raw.mes,

    taxaIva: raw.taxaIva,
    valorIva: raw.valorIva,
    retencao: raw.retencao,
    incidencia: raw.incidencia,
    valorDesconto: raw.valorDesconto,
    descontoProduto: raw.descontoProduto,
    multa: raw.multa,

    mesTempId: raw.mesTempId,
    codigoAnoLectivo: raw.codigoAnoLectivo,

    valorPago: raw.valorPago,
    valorATransportar: raw.valorATransportar,

    estado: raw.estado,
  };
}

function mapInvoice(raw: RawConciliationInvoice): ConciliationInvoice {
  return {
    codigo: raw.codigo,
    descricao: raw.descricao ?? "",
    referencia: raw.referencia,
    estado: raw.estado,
    totalPreco: raw.totalPreco,
    valorApagar: raw.valorApagar,
    data: raw.data,
    anoLectivo: raw.anoLectivo,
    itens: (raw.itens ?? []).map(mapItem),
  };
}

function mapStudent(
  raw: RawConciliationStudent | null | undefined,
): ConciliationStudent {
  return {
    codigoMatricula: raw?.codigoMatricula ?? null,
    nome: raw?.nome ?? null,
    codigoCurso: raw?.codigoCurso ?? null,
    curso: raw?.curso ?? null,
    faculdade: raw?.faculdade ?? null,
  };
}

function mapConciliationDetails(
  raw: RawConciliationDetails,
): ConciliationDetails {
  return {
    id: raw.id,
    status: raw.status,
    descricaoCriacao: raw.descricaoCriacao ?? "",
    descricaoValidacao: raw.descricaoValidacao,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    createdBy: raw.createdBy,
    validatedBy: raw.validatedBy,
    validatedAt: raw.validatedAt,

    facturaOriginal: mapInvoice(raw.facturaOriginal),
    facturaPropostaAlteracao: mapInvoice(raw.facturaPropostaAlteracao),

    estudante: mapStudent(raw.estudante),
  };
}

export const getConciliationDetails = async (
  id: number,
): Promise<ConciliationDetails> => {
  const { data } = await axiosNestFinance.get<RawConciliationDetails>(
    `/conciliacao-dividas/${id}`,
  );

  return mapConciliationDetails(data);
};
