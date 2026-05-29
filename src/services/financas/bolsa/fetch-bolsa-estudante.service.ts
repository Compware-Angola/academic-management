import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type FetchBolsaEstudanteParams = {
  codigoInstituicao?: number;
  codigoAnoLectivo?: number;
  status?: string;
  codigoBolsa?: number;
  codigoTipoCredito?: number;
  codigoMatricula?: number;
  nome?: string;
  cursoId?: number;
  page?: number;
  limit?: number;
};

export type BolsaEstudante = {
  codigo: number;
  codigo_matricula: number;
  isentar_multa: "SIM" | "NAO";
  nome_completo: string;
  bilhete_identidade: string;
  curso: string;
  tipo_bolsa?: string;
  codigo_utilizador: number;
  canal?: number;
  created_at: string;
  updated_at?: string;
  data_inicio_bolsa?: string;
  data_fim_bolsa?: string;
  codigo_instituicao?: number;
  instituicao?: string;
  codigo_anolectivo: number;
  ano_lectivo?: string;
  observacao?: string;
  historico?: string;
  status_?: number;
  semestre: number;
  estadobolsa?: number;
  tipo_aluno_id?: number;
  valor_desconto: number;
  codigo_tipo_desconto: number;
  tipo_desconto: string;
  codigo_tipo_credito?: number;
  tipo_credito?: string;
  codigo_bolsa?: number;
  bolsa?: string;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchBolsaEstudanteResponse = {
  data: BolsaEstudante[];
  meta: Meta;
};

export async function fetchBolsaEstudanteService(
  params?: FetchBolsaEstudanteParams,
): Promise<FetchBolsaEstudanteResponse> {
  const { data } = await axiosNestFinance.get<FetchBolsaEstudanteResponse>(
    "credito-educacional",
    { params },
  );

  return data;
}
