import { axiosNestGa } from "@/lib/axios-nest-ga";


export interface AprovarSolicitacaoPayload {
  solicitacaoId: number;
  userId: number;
  descricao: string;
}

export async function aprovarSolicitacao(
  payload: AprovarSolicitacaoPayload
) {
  const { data } = await axiosNestGa.post(
    "/solicitacoa/aprovar-solicitacao",
    payload
  );

  return data;
}
