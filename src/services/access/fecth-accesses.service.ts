import { axiosNestGa } from "@/lib/axios-nest-ga";

export type FetchAcessosParams = {
  utilizadorId?: number;
  grupoId?: number;
  apenasAtivos?: boolean; // true por padrão
  sigla?: string;
  designacao?: string;
  page?: number;          // padrão: 1
  limit?: number;         // padrão: 25, máximo 100
};

export type tipoAccesses = {
  pk_acesso: number;
  designacao: string;
  sigla: string;
  moduloId: number;
  modulonome: string;
  tipoacesso: string;
  ativo: boolean;
  dataativacao: string;
};


export type AccessesPaginatedResponse = {
  data: tipoAccesses[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchAccesses(
  params?: FetchAcessosParams
): Promise<AccessesPaginatedResponse> {

  const queryParams: Record<string, any> = {};

  if (params?.utilizadorId !== undefined) {
    queryParams.utilizadorId = params.utilizadorId;
  }

  if (params?.grupoId !== undefined) {
    queryParams.grupoId = params.grupoId;
  }
  if (params?.sigla !== undefined) {
    queryParams.sigla = params.sigla;
  }
  if (params?.designacao !== undefined) {
    queryParams.designacao = params.designacao;
  }

  // Se não for passado, default é true
  queryParams.apenasAtivos = params?.apenasAtivos ?? true;

  // Defaults para paginação
  queryParams.page = params?.page ?? 1;
  queryParams.limit = Math.min(params?.limit ?? 25, 100); // nunca acima de 100

  const {data} = await axiosNestGa.get<AccessesPaginatedResponse>(
    "/acess_management/details/all",
    { params: queryParams }
  );

  return data;
}
