import { axiosNestGa } from "@/lib/axios-nest-ga"
import { AuthStorage } from "@/util/auth-storage"

export interface CreatePersonUserRequest {
  nomeCompleto: string
  numDocIdentificacao: string
  email: string
  dataDeNascimento: string
  tipoDocumentoId: string
  sexoId: string
  estadoCivilId: string
  nacionalidadeId: string
}

export interface CreatePersonUserResponse{
  message: string
  username: string
  senhaTemporariaGerada: boolean
  observacao: string

}

export async function createPersonUser(user: CreatePersonUserRequest): Promise<CreatePersonUserResponse>{
  const userID = AuthStorage.getUser().user_id
    const {data} = await axiosNestGa.post("acess_management/create-person-user",user, {
      headers: {
        "x-user-logado-id": userID,
      },
    })

    return data
}