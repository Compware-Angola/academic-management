import { axiosApexGa } from "@/lib/axios-apex-ga";

export type FetchInstituicaoParams = {
  instituicao?: string;
  nif?: string;
};

export interface Instituicao {
  codigo?: number;
  instituicao: string;
  nif: string;
  contacto: string | null;
  endereco: string | null;
  sigla: string | null;
  tipo_instituicao: number;
}

export interface ListInstituicaoResponse {
  items: Instituicao[];
}

export async function listInstituicao(
  params: FetchInstituicaoParams = {}
): Promise<ListInstituicaoResponse> {

  const queryParams: Record<string, any> = {};

  if (params.instituicao?.trim()) {
    queryParams.instituicao = params.instituicao.trim();
  }

  if (params.nif?.trim()) {
    queryParams.nif = params.nif.trim();
  }


  const { data } = await axiosApexGa.get<ListInstituicaoResponse>(
    "/financa/instituicao",
    {
      params: queryParams,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    }
  );

  return data;
}
