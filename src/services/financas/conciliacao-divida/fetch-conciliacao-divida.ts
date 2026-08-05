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
