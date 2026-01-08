import { axiosNestGa } from "@/lib/axios-nest-ga"
import { AuthStorage } from "@/util/auth-storage"

export interface CreatePersonUserRequest {
  nomeCompleto: string
  numDocIdentificacao: string
  email: string
  dataDeNascimento: number
  tipoDocumentoId: number
  sexoId: number
  estadoCivilId: number
  nacionalidadeId: number
}

export interface CreatePersonUserResponse{
  message: string
  username: string
  senhaTemporariaGerada: boolean
  observacao: string

}

export async function createPersonUser(user: CreatePersonUserRequest): Promise<CreatePersonUserResponse>{
 
    const {data} = await axiosNestGa.post("acess_management/create-person-user",user)

    return data
}