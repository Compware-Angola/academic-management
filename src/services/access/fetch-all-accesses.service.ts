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
    const user = AuthStorage.isAuthenticated

    const queryParams: Record<string, any> = {};

    console.log("User information: ", user)
    //console.log("Grupo id: ", params.grupoId)

    if (params?.apenasAtivos !== undefined) {
        queryParams.apenasAtivos = params.apenasAtivos;
    }

<<<<<<< HEAD
    //console.log("Auth user:", user);
    //console.log("Query params:", queryParams);
=======

>>>>>>> d6083006b98f53dcb8dadf96e860894ff7e8de14

    const response = await axiosNestGa.get<AcessoResponse[]>(
        "/acess_management/details/all/dropdown",
         { params: queryParams }

    );

  return response.data;
}