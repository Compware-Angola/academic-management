import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";


export type createLogsParams = {
    dataInicio: string;
    dataFim: string
} 

export type tipoLogsAccesses = {
    pkLogAcesso: number,
    descricao: string,
    fkAcesso: null,
    fkFuncionalidade: null,
    fkUtilizadorResponsavel: number,
    fkGrupoAfetado: null,
    fkOperacaoLog: string,
    createdAt: string,
    ip: string
}

export async function fetchLogsAccessos(params: createLogsParams):Promise<tipoLogsAccesses[]>{
const userID = AuthStorage.getUser().user_id.toString()
const _params = {...params, utilizadorId:userID}
    const {data} = await axiosNestGa.get("/acess_management/logs-acessos-funcionalidade",{params:_params})

    return data
}