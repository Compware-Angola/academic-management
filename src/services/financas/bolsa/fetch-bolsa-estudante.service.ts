import { axiosApexGa } from "@/lib/axios-apex-ga";

export type FetchBolsaEstudanteParams = {
  codigoInstituicao?: number;
  codigoAnoLectivo?: number;
  status?: string;
  codigoBolsa?: number;
  codigoTipoCredito?: number;
  codigoMatricula?: number;
  nome?: string;
  curso?: string;
};

export type BolsaEstudante = {
  codigo_matricula: number;
  nome_completo: string;
  bilhete_identidade: string;
  curso: string;
  tipo_bolsa: string;
  codigo_utilizador?: number;
  canal?: string;
  created_at: string;
  updated_at?: string;
  data_inicio_bolsa?: string;
  data_fim_bolsa?: string;
  codigo_instituicao: number;
  instituicao: string;
  codigo_anolectivo: number;
  ano_lectivo: string;
  observacao?: string;
  historico?: string;
  status_?: string;
  semestre?: number;
  estadobolsa?: string;
  ref_utilizador?: string;
  tipo_aluno_id?: number;
  codigo: number;
  valor_desconto: number;
  codigo_tipo_desconto: number;
  tipo_desconto: string;
  codigo_tipo_credito: number;
  tipo_credito: string;
  codigo_bolsa: number;
  bolsa?: string;
};

export type PaginationLink = {
  $ref: string;
};

export type FetchBolsaEstudanteResponse = {
  items: BolsaEstudante[];
  first?: PaginationLink;
  next?: PaginationLink;
  prev?: PaginationLink;
};

export async function fetchBolsaEstudanteService(
  params?: FetchBolsaEstudanteParams,
  url?: string,
): Promise<FetchBolsaEstudanteResponse> {
  if (url) {
    const { data } = await axiosApexGa.get<FetchBolsaEstudanteResponse>(url);
    return data;
  }

  const { data } = await axiosApexGa.get<FetchBolsaEstudanteResponse>(
    "/financa/bolsa/estudante",
    { params },
  );

  return data;
}
