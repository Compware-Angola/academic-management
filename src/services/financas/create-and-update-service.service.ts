import { axiosNestFinance } from "@/lib/axios-nest-finance";

// -------------------- TIPOS --------------------
export type TipoServicoPayload = {
  taxaIvaId: number;
  motivoIsencaoIvaCodigo: number;
  preco: number;
  descricao: string;
  tipoServico: string;
  estado: boolean;
  data: string;
  disponibilizarAluno: boolean;
  codigoGradeCurricular: number;
  mestrado: boolean;
  canal: number;
  poloId: number;
  cacuaco: boolean;
  codigoAnoLectivo: number;
  valorAnterior: number;
  visualizarNoPortal: boolean;
  sigla: string;
  estadoSolicitacao: number;
  tipoCandidatura: number;
};

export type UpdateTipoServicoPayload = {
  taxaIvaId?: number;
  motivoIsencaoIvaCodigo?: number;
  preco?: number;
  descricao?: string;
  estado?: boolean;
  poloId?: number;
  codigoAnoLectivo?: number;
};

// -------------------- RESPONSE --------------------
export type TipoServicoResponse = {
  sucesso: number;
  mensagem: string;
  codigo?: number;
  descricao?: string;
};

// -------------------- CREATE --------------------
export async function createTipoServicoService(
  payload: TipoServicoPayload
): Promise<TipoServicoResponse> {
  const { data } = await axiosNestFinance.post("/type-service", payload);
  return data;
}

// -------------------- UPDATE --------------------
export async function updateTipoServicoService(
  codigo: number,
  payload: UpdateTipoServicoPayload
): Promise<TipoServicoResponse> {
  const { data } = await axiosNestFinance.put(`/type-service/${codigo}`, payload);
  return data;
}
