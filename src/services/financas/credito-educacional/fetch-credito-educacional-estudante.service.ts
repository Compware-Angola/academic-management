import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreditoEducacionalEstudante = {
  codigo_matricula: number;
  nome_completo: string;
  bilhete_identidade: string;
  curso: string;
  codigo_tipo_bolsa: number;
  tipo_bolsa: string;
  desconto: number;
  codigo_utilizador: number | null;
  canal: number | null;
  created_at: string;
  updated_at: string;
  data_inicio_bolsa: null | string;
  data_fim_bolsa: null | string;
  codigo_instituicao: number;
  instituicao: string;
  codigo_anolectivo: number;
  ano_lectivo: string;
  observacao: null | string;
  historico: null | string;
  status_: number;
  semestre: number | null;
  estadobolsa: null | number;
  ref_utilizador: number;
  tipo_aluno_id: number;
  codigo: number;
  codigo_tipo_desconto: number;
  tipo_desconto: string;
  codigo_tipo_credito: number;
  tipo_credito: string;
  codigo_credito: number;
  credito: string;
};

export type CreditoEducacionalEstudanteResponse = {
  items: CreditoEducacionalEstudante[];
};

export async function fetchCreditoEducacionalEstudante(): Promise<CreditoEducacionalEstudanteResponse> {
  const { data } = await axiosApexGa.get<CreditoEducacionalEstudanteResponse>(
    "/financa/credito-educacional/estudante",
  );

  return data;
}
