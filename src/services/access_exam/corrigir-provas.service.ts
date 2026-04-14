import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CorrigirProvasResponse = {
  message: string;
  processados: number;
  admitidos: number;
  ignorados: number;
  erros: number;
};

/**
 * Serviço para processar a correção automática das provas do Exame de Acesso
 * Endpoint: POST /exames-de-acesso/corrigir-provas
 */
export async function corrigirProvas(): Promise<CorrigirProvasResponse> {
  const { data } = await axiosNestGa.post<CorrigirProvasResponse>(
    "/exames-de-acesso/corrigir-provas"
  );

  return data;
}