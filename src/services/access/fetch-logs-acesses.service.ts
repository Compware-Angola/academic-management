import { axiosNestGa } from "@/lib/axios-nest-ga";

export type createLogsParams = {
  dataInicio: string;
  dataFim: string;
  utilizadorId?: number;
  page?: number;
  limit?: number;
  search?: string;
};

export type tipoLogsAccesses = {
  pkLogAcesso: number;
  descricao: string;
  fkAcesso: null;
  fkFuncionalidade: null;
  fkUtilizadorResponsavel: number;
  fkGrupoAfetado: null;
  fkOperacaoLog: string;
  createdAt: string;
  ip: string;
};

export type LogsPaginatedResponse = {
  data: tipoLogsAccesses[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchLogsAccessos(
  userId: number,
  params: createLogsParams
): Promise<LogsPaginatedResponse> {
  const _params = { ...params, utilizadorId: userId };

<<<<<<< HEAD
export async function fetchLogsAccessos(params: createLogsParams):Promise<LogsPaginatedResponse>{
    const userID = 1548 
    const _params = {...params}

    
  
    const {data} = await axiosNestGa.get("/acess_management/logs-acessos-funcionalidade",{params:_params})
    
    
    return data
}
=======
  //console.log("Params no service: ", params)

  const { data } = await axiosNestGa.get(
    "/acess_management/logs-acessos-funcionalidade",
    { params: _params }
  );

  //console.log("Dados rerornados da api: ", data)

  return data;
}
>>>>>>> develop
