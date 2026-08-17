import { axiosNestGa } from "@/lib/axios-nest-ga";

export type TipoCalendario = {
  codigo: number;
  designacao: string;
  ativoParaAluno: number;
  sigla: string;
};

export type FetchTipoCalendariosParams = {
  page?: number;
  limit?: number;
  search?: string;
  ativoParaAluno?: number;
};

export type FetchTipoCalendariosResponse = {
  data: TipoCalendario[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateTipoCalendarioBody = {
  designacao?: string;
  ativoParaAluno?: number;
  sigla?: string;
};

export type UpdateTipoCalendarioBody = {
  codigo: number;
  designacao?: string;
  ativoParaAluno?: number;
  sigla?: string;
};

export async function fetchTipoCalendarios(params: FetchTipoCalendariosParams) {
  const { data } = await axiosNestGa.get<FetchTipoCalendariosResponse>(
    "/tipo-calendario",
    { params },
  );
  return data;
}

export async function fetchTipoCalendario(codigo: number) {
  const { data } = await axiosNestGa.get<TipoCalendario>(
    `/tipo-calendario/${codigo}`,
  );
  return data;
}

export async function createTipoCalendario(body: CreateTipoCalendarioBody) {
  const { data } = await axiosNestGa.post<TipoCalendario>(
    "/tipo-calendario",
    body,
  );
  return data;
}

export async function updateTipoCalendario(body: UpdateTipoCalendarioBody) {
  const { codigo, ...rest } = body;
  const { data } = await axiosNestGa.patch<TipoCalendario>(
    `/tipo-calendario/${codigo}`,
    rest,
  );
  return data;
}
