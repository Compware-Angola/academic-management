// src/services/solicitacao.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface RejectSolicitacaoPayload {
  solicitacaoId: number;
  userId: number;
  descricao: string;
}

export async function rejectSolicitacao(
  payload: RejectSolicitacaoPayload
) {
  
  const response = await axiosNestGa.post(
    "/solicitacoa/rejectar-solicitacao",
    payload
  );

  return response.data;
}
