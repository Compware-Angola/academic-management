import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface CreateServiceMassItem {
  taxaIvaId: number;
  motivoIsencaoIvaCodigo: number;
  preco: number;
  descricao: string;
  tipoServico: string;
  estado: boolean;
  data: string;
  disponibilizarAluno: boolean;
  codigoGradeCurricular: number | null;
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
}

export interface CreateServicesMassPayload {
  services: CreateServiceMassItem[];
}
export interface ServiceMassRegistered {
  descricao: string;
  sigla: string;
  codigoAnoLectivo: number;
  poloId: number;
  status: string;
  motivo?: string;
}
export interface CreateServicesMassResponse {
  message: string;
  totalRecebidos: number;
  totalCadastrados: number;
  totalDuplicados: number;
  cadastrados: ServiceMassRegistered[];
  duplicados: ServiceMassRegistered[];
}

export async function createServicesMass(
  payload: CreateServicesMassPayload,
): Promise<CreateServicesMassResponse> {
  const { data } = await axiosNestFinance.post("/type-service/mass", payload);

  return data;
}
