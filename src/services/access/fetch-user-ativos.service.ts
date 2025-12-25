import { axiosNestGa } from "@/lib/axios-nest-ga"


export type FetchUserParams = {
    ativo?: boolean
}

export type User = {
    
    pkUtilizador: number,
    nome: string,
    username: string,
    email: string,
    active: boolean,
    refPessoa: {
      personId: number,
      personName: string
    },
    createdAt: string,
    updatedAt: string
  
}


export async function fetchUserActive(params?: FetchUserParams): Promise<User[]>{
    const response = await axiosNestGa.get<User[]>("users",{
        params
    })

    return response.data as User[]
}