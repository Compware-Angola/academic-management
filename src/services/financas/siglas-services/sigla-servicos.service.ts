import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type SiglaTipoServico = {
  codigo: number;
  sigla: string;
  descricao: string;
  tipo_candidatura: number;
};

export type DeleteSiglaTipoServicoBody = {
  codigo: number;
};
export type FetchSiglaTipoServicosParams = {
  search?: string;
};

export type CreateSiglaTipoServicoBody = {
  sigla: string;
  descricao: string;
};

export type UpdateSiglaTipoServicoBody = {
  codigo: number;
  sigla?: string;
  descricao?: string;
  tipo_candidatura?: number;
};

export async function fetchSiglaTipoServicos(
  params: FetchSiglaTipoServicosParams,
) {
  const { data } = await axiosNestFinance.get<SiglaTipoServico[]>(
    "/sigla-tipo-servicos",
    { params },
  );
  return data;
}

export async function createSiglaTipoServico(body: CreateSiglaTipoServicoBody) {
  const { data } = await axiosNestFinance.post<SiglaTipoServico>(
    "/sigla-tipo-servicos",
    body,
  );
  return data;
}

export async function updateSiglaTipoServico(body: UpdateSiglaTipoServicoBody) {
  const { codigo, ...rest } = body;
  const { data } = await axiosNestFinance.patch<SiglaTipoServico>(
    `/sigla-tipo-servicos/${codigo}`,
    rest,
  );
  return data;
}

export async function deleteSiglaTipoServico(body: DeleteSiglaTipoServicoBody) {
  await axiosNestFinance.delete(`/sigla-tipo-servicos/${body.codigo}`);
}
