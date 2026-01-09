import { axiosNestGa } from "@/lib/axios-nest-ga";

export type FetchAcessosParams = {
  grupoId?: number;
  apenasAtivos?: boolean;
};

export type AcessoResponse = {
  id: number;
  designacao: string;
  sigla: string;
  moduloId: number;
  moduloNome: string;
  tipoAcesso: string;
  ativo: boolean;
  dataAtivacao: string;
};

export async function fetchAcessos(
  params?: FetchAcessosParams
): Promise<AcessoResponse[]> {
    

    const queryParams: Record<string, any> = {};



    if (params?.apenasAtivos !== undefined) {
        queryParams.apenasAtivos = params.apenasAtivos;
    }


  const response = await axiosNestGa.get<AcessoResponse[]>(
    "/acess_management/details/all/dropdown",
    { params: queryParams }
  );

  return response.data;
}
