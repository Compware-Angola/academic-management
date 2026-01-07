import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

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

    const user = AuthStorage.getUser()
    const queryParams: Record<string, any> = {};


    if (params?.apenasAtivos !== undefined) {
        queryParams.apenasAtivos = params.apenasAtivos;
    }

    //console.log("Auth user:", user);
    console.log("Query params:", queryParams);

    const response = await axiosNestGa.get<AcessoResponse[]>(
        "/acess_management/details/all",
         { params: queryParams }

    );

  return response.data;
}
