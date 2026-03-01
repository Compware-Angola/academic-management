import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CreateAvisoRequest {
  assunto: string;
  date_expiracao?: string;
  userId?: number;
  descricao: string;
  sigla?: string;
  fileName?: string;
  destino?: number;
  curso?: number;
  periodo?: number;
  canal?: number;
  status?: number;
  origem?: number;
}

export interface CreateAvisoResponse {
  message: string;
}

export async function createAvisoService(
  payload: CreateAvisoRequest
): Promise<CreateAvisoResponse> {
  
  const { data } = await axiosNestGa.post(
    "/solicitacoa/aviso",
    payload
  );

  return data;
}