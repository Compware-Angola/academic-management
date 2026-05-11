
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ValidateDocumentResponse = {
  codigo_matricula: number;
  estado: string;
  nome_completo: string;
  bi: string;
  email: string;
  contacto: string | null;
  contacto_alternativo: string | null;
  data_nascimento: string;
  data_emissao_bi: string;
  data_validade_bi: string;
  pai: string;
  mae: string;
  naturalidade: string;
  estado_civil: string;
  sexo: string;
  morada: string;
  nacionalidade: string;
  curso_codigo: number;
  curso: string;
  faculdade: string;
  periodo: string;
  grau: string;
  regime: string;
  tipo_documento: string;
  foto: string;
  data_registo: string;
  utilizador: string;
};

/**
 * Valida documento pelo código
 */
export async function validateDocument(
  code: string

): Promise<ValidateDocumentResponse> {
  const { data } = await axiosNestGa.get<ValidateDocumentResponse>(
    `/documents/validate-document`,
    {
      params: { code },
    }
  );

  return data;
}