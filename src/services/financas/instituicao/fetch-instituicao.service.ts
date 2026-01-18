import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface Instituicao {
  codigo: number;
  instituicao: string;
  nif: string;
  contacto: string | null;
  endereco: string | null;
  sigla: string | null;
  tipo_instituicao: number;
}

export interface FetchInstituicaoResponse {
  items: Instituicao[];
}

export interface FetchInstituicaoParams {
  instituicao?: string;
  tipo?: number;
  nif?: string;
}

export async function fetchInstituicoes(
  params?: FetchInstituicaoParams
): Promise<FetchInstituicaoResponse> {
  const { data } = await axiosApexGa.get<FetchInstituicaoResponse>(
    "financa/instituicao",
    {
      params,
    }
  );

  return data;
}
