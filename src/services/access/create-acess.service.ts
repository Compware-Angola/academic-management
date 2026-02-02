import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CreateAcessoRequest {
  designacao: string;
  descricao: string;
  sigla: string;
  icone?: string;
  fkModulo?: number;
  fkSubmenu?: number;
  fkPagina?: number;
  fkTipoAcesso?: number;
  obs?: string;
  ordem?: number;
  activeDate?: string;
  activeState?: boolean;
}

export interface CreateAcessoResponse {
  message: string;
}

export async function createAcessoService(
  payload: CreateAcessoRequest
): Promise<CreateAcessoResponse> {
  console.log("SERVICE: ", payload)
  const { data } = await axiosNestGa.post(
    "acess_management/novo-acesso",
    payload
  );

  return data;
}
