// src/services/documents/fetch-document-types.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";

export type DocumentType = {
  DESIGNACAO: string; // ex: "Bilhete de Identidade"
  CODIGO: number;     // ex: 1
};

export type DocumentTypesResponse = DocumentType[];

/**
 * Busca os tipos de documentos disponíveis
 */
export type DocumentTypeFormatted = {
  designacao: string;
  codigo: number;
};

export async function fetchDocumentTypes(): Promise<DocumentTypeFormatted[]> {
  const { data } = await axiosApexGa.get<DocumentTypesResponse>(
    `/auto_old/FK2_TB_TIPO_DOCUMENTOS`
  );

  return data.map(item => ({
    designacao: item.DESIGNACAO,
    codigo: item.CODIGO,
  }));
}