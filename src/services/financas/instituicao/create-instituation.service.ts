import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface CreateInstituicaoPayload {
  instituicao: string;
  nif: string;
  contacto: string;
  endereco: string;
  sigla: string;
}

export async function createInstituicao(
  payload: CreateInstituicaoPayload,
): Promise<void> {
  const { data } = await axiosApexGa.post("/financa/instituicao", payload);

  return data;
}
