import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =======================
 * TIPO - Retorno do código gerado
 * ======================= */
export type GeneratedCode = {
  codigo: string;
};

/* =======================
 * FETCH - Gerar código de documento
 * ======================= */
export const generateDocumentCode = async (): Promise<GeneratedCode> => {
  const response = await axiosNestGa.post<GeneratedCode>(
    `/documents/generate-code`,
  );

  return response.data;
};