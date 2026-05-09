// services/get-monthly-fees-value.ts

import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface MonthlyFeeService {
  codigo: number;
  descricao: string;
  preco: number;
  tipo_servico: string;
  estado: string;
  disponibilizar_aluno: string;
  visualizar_no_portal: string;
  codigo_ano_lectivo: number;
}

export interface MonthlyFeesValueResponse {
  servicos: MonthlyFeeService[];
}

export interface MonthlyFeesValueParams {
  anoLectivoId: number;
  cursoId: number;
  poloId: number;
}

export async function getMonthlyFeesValue({
  anoLectivoId,
  cursoId,
  poloId,
}: MonthlyFeesValueParams): Promise<MonthlyFeeService[]> {
  const response = await axiosApexGa.get<MonthlyFeesValueResponse>(
    `/financial/monthly-fees-value/${anoLectivoId}/${cursoId}/${poloId}`,
  );

  return response.data.servicos ?? [];
}
