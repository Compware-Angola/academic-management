// services/finance-api.ts ou similar

import { axiosNestFinance } from "@/lib/axios-nest-finance";

// Tipos baseados na rota do frontend/backend
export interface MonthlyFeeQueryParams {
  academicYear: string; // Vai como codAnoLectivo
  enrollmentCode: string; // Vai como codigo_matricula
  status: string;
  page?: number;
  limit?: number;
}
export type Mensalidade = {
  codigo_servico?: number;
  mes_temp_id: number;
  mes: string;
  data_inicial: string;
  data_operacao: string | null;
  data_final: string;
  data_limite: string;
  total_preco: number;
  semestre: number;
  data_final_desconto: string | null;
  data_pagamento: string | null;
  id_item: number;
  id_tipo_servico: number;
  descricao_servico: string;
  tipo_servico: string;
  codigo_matricula: string | null;
  ano_lectivo_fatura: string | null;
  estado_fatura: string | null;
  total_item: number;
  valor_pago: number;
  reference: string | null;
  multa: number | null;
  desconto: number | null;
  data_vencimento: string | null;
  status_pagamento: number | string; // pode vir "1"
  codigo_factura: number | null;
  mensalidade: number | null;
  total: number | null;
  instituicao_pagou?: boolean | null;
  codigo_bolseiro?: number | null;
  observacao?: string | null;



};

export type MonthlyFeeDataResponse = {
  data: Mensalidade[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Função para buscar os dados financeiros do estudante (mensalidades e referências)
 * usando Query Parameters, alinhada com a rota do backend.
 *
 * @param params {MonthlyFeeQueryParams} Contém ano letivo, código da matrícula, página e limite.
 * @returns {Promise<MonthlyFeeDataResponse>}
 */
export async function getmonthlyFee({
  academicYear,
  enrollmentCode,
  status,
  page = 1, // Valores padrão para paginação
  limit = 10,
}: MonthlyFeeQueryParams): Promise<MonthlyFeeDataResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    codigo_matricula: enrollmentCode, // Mapeamento correto
    codAnoLectivo: academicYear,
    status: status, // Mapeamento correto
  });

  const url = `financial/monthly-fees?${queryParams.toString()}`;

  return (await axiosNestFinance.get(url)).data;
}
