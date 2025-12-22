

import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CreateLancamentoPautaPayload = {
  anoLectivoId: number;
  docenteId: number;
  gradeCurricularId: number;
  fkEstadoLancamentoPauta: number;
  fkTipoAvaliacao: number;
ficheiroName:string
};

export type CreateLancamentoPautaResponse = {
  success: boolean;
  message: string;

};

export async function createLancamentoPauta(
  payload: CreateLancamentoPautaPayload
): Promise<CreateLancamentoPautaResponse> {
  const { data } = await axiosNestGa.post<CreateLancamentoPautaResponse>(
    "/assessment/lancamento/pauta/create",
    payload
  );

  return data;
}