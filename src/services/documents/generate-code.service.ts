import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GenerateDocumentCodeDto = {
  documento?: string;
  anoLetivo?: string | number;
  status?: string;
  codigoMatricula: number;
  tipoDocumento: number;
};

/* =======================
 * TIPO - Retorno do código gerado
 * ======================= */
export type GeneratedCode = {
  codigo: string;
};

/* =======================
 * FETCH - Gerar código de documento
 * ======================= */
export const generateDocumentCode = async (
  payload: GenerateDocumentCodeDto
): Promise<GeneratedCode> => {
  const response = await axiosNestGa.post<GeneratedCode>(
    `/documents/generate-code`,
    payload // 👈 agora vai no body
  );

  return response.data;
};