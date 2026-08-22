import { axiosNestGa } from "@/lib/axios-nest-ga";

export type InscricoesPorDiaParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoFaculdade?: number;
  codigoTurno?: number;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
};

export type InscricaoPorDia = {
  data: string;
  subtotal: number;
  pagos?: number;
};

export type FiltrosDesignacoes = {
  curso: string | null;
  faculdade: string | null;
  turno: string | null;
  anolectivo: string | null;
};

export type InscricoesPorDiaResponse = {
  data: InscricaoPorDia[];
  total: number;
  totalgeralcandidatos: number;
  totalpagos?: number;
  filtros: FiltrosDesignacoes;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchInscricoesPorDia(
  params: InscricoesPorDiaParams,
): Promise<InscricoesPorDiaResponse> {
  const { data } = await axiosNestGa.get("/exames-de-acesso/estatistica/dia", {
    params,
  });
  return data;
}
