import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ServiceType = "MENSALIDADE" | "OUTROS";

export interface ServiceByYear {
  codigo: number;
  taxa_iva_id: number;
  motivo_isencao_iva_codigo: number;
  preco: number;
  descricao: string;
  tiposervico: string;
  datacriacao: string;
  estado: string;
  data: string;
  disponibilizar_aluno: "SIM" | "NAO";
  codigo_grade_currilular: number | null;
  mestrado: "SIM" | "NAO";
  canal: number;
  polo_id: number;
  cacuaco: "SIM" | "NAO";
  codigo_ano_lectivo: number;
  valor_anterior: number;
  visualizar_no_portal: "SIM" | "NAO";
  sigla: string;
  estado_solicitacao: number;
  tipo_candidatura: number;
  polo_designacao: string;
  anolectivo: string;
}

export interface ListServicesByYearParams {
  codigoAnoLectivo: number;
  tipo: ServiceType;
}

export async function listServicesByYear(
  params: ListServicesByYearParams,
): Promise<ServiceByYear[]> {
  const { data } = await axiosNestFinance.get("/type-service/list-by-year", {
    params,
  });

  return data;
}
