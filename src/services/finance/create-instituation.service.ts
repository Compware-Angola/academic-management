// services/financa/create-instituicao.service.ts

import { axiosApexGa } from "@/lib/axios-apex-ga";
/**
 * Payload para criação de instituição
 * Obs: tipoInstituicaoId é OBRIGATÓRIO
 */
export interface CreateInstituicaoRequest {
  instituicao: string;
  nif: string;
  contacto?: string;
  endereco?: string;
  sigla?: string;
}

/**
 * Response esperado após criação
 */
export interface CreateInstituicaoResponse {
  instituicao: string;
  nif: string;
  sigla?: string;
  createdAt: string;
}

/**
 * Cria uma nova instituição
 */
export async function createInstituicao(
  payload: CreateInstituicaoRequest
): Promise<CreateInstituicaoResponse> {
  const { data } = await axiosApexGa.post(
    "/financa/instituicao",
    {
      instituicao: payload.instituicao,
      nif: payload.nif,
      contacto: payload.contacto,
      endereco: payload.endereco,
      sigla: payload.sigla,
    }
  );

  return data;
}
