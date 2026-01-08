import { axiosNestGa } from "@/lib/axios-nest-ga"

export interface CreatePersonUserRequest {
  nomeCompleto: string
  numDocIdentificacao: string
  email: string
  dataDeNascimento: string
  tipoDocumentoId: number
  sexoId: number
  estadoCivilId: number
  nacionalidadeId: number
  telefone1: string
  telefone2: string
}

export interface CreatePersonUserResponse{
  message: string
  username: string
  senhaTemporariaGerada: boolean
  observacao: string

}

export async function createPersonUser(payload: CreatePersonUserRequest,userLogadoId :number): Promise<CreatePersonUserResponse>{

    console.log("payload antes de enviar:", payload)

    const {data} = await axiosNestGa.post("/acess_management/create-person-user",
      payload,
      {
        headers: {
          "x-user-logado-id": userLogadoId,
        }
      }
    )

    console.log("DATA SERVICE", data)

    return data
}