import { axiosNestGa } from "@/lib/axios-nest-ga"

export type FetchGruposParams = {
     ativo?: "true" | "false";
}

export type GruposResponse = {
    pkGrupo: number
    designacao: string
    sigla: string
    fkTipoDeGrupo: number
    activeState: boolean
}


export async function fetchGrupos(params?: FetchGruposParams): Promise<GruposResponse[]>{
    const response = await axiosNestGa.get<GruposResponse[]>("/grupos",{
        params
    })

    return response.data as GruposResponse[]
}