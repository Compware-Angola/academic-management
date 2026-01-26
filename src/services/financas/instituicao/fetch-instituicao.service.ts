import { axiosApexGa } from "@/lib/axios-apex-ga";

export type FetchInstituicaoParams = {
  instituicao?: string;
  nif?: string;
  tipo?: number;
};

export type Instituicao = {
  codigo: number;
  instituicao: string;
  nif: string;
  contacto: string | null;
  endereco: string | null;
  sigla: string | null;
  tipo_instituicao: number;
};

export type PaginationLink = {
  $ref: string;
};

export type FetchInstituicaoResponse = {
  items: Instituicao[];
  first?: PaginationLink;
  next?: PaginationLink;
  prev?: PaginationLink;
};
export async function fetchInstituicaoService(
  params?: FetchInstituicaoParams,
  url?: string,
): Promise<FetchInstituicaoResponse> {
  if (url) {
    const { data } = await axiosApexGa.get<FetchInstituicaoResponse>(url);
    return data;
  }

  const { data } = await axiosApexGa.get<FetchInstituicaoResponse>(
    "/financa/instituicao",
    { params },
  );

  return data;
}
