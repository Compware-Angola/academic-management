import { axiosNestGa } from "@/lib/axios-nest-ga"

export type FetchUserParams = {
    ativo?: boolean
}

export type UserFilterResponse = {
    
    pkUtilizador: number,
    nome: string,
    username: string,
    email: string,
    active: boolean,
    refPessoa: {
      pk: number,
      desc: string
    },
    createdAt: string,
    updatedAt: string
  
}


export async function fetchUserActive(params?: FetchUserParams): Promise<UserFilterResponse[]>{
    const response = await axiosNestGa.get<UserFilterResponse[]>("/acess_management/users",{
        params
    })

    return response.data as UserFilterResponse[]
}