import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdatePersonUserRequest {
  nomeCompleto?: string;
  numDocIdentificacao?: string;
  email?: string;
  dataDeNascimento?: string; 
  tipoDocumentoId?: number;
  sexoId?: number;
  estadoCivilId?: number;
  nacionalidadeId?: number;
  telefone1?: string;
  telefone2?: string;
}

export interface UpdatePersonUserResponse {
  message: string;
}

export async function updatePersonUser(
  id: string,
  payload: UpdatePersonUserRequest
): Promise<UpdatePersonUserResponse> {
    console.log("payload", payload);
  const { data } = await axiosNestGa.put(
    `acess_management/update-user/${id}`,
    payload
  );

  return data;
}
