import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CreatePersonUserRequest {
  nomeCompleto: string;
  numDocIdentificacao: string;
  email: string;
  dataDeNascimento: string;
  tipoDocumentoId: number;
  sexoId: number;
  estadoCivilId: number;
  nacionalidadeId: number;
  telefone1: string;
  telefone2: string;
  senha?: string;
}

export interface CreatePersonUserResponse {
  message: string;
  username: string;
  senhaTemporariaGerada: boolean;
  observacao: string;
}

export async function createPersonUser(
  payload: CreatePersonUserRequest
): Promise<CreatePersonUserResponse> {
  const { data } = await axiosNestGa.post(
    "acess_management/create-person-user",
    payload
  );

  return data;
}
