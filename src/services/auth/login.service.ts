import { axiosNestAuth } from "@/lib/axios-nest-auth";

export class LoginPayload {
  username: string;
  password: string;
  platform?: string = 'GA';
}
export interface Group {
  codigo: number;                  
  designation: string;            
  sigla: string;                 
  type_group: number;              
  type_group_designation: string;   
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: User;
  groups: Group[];
  mensagem: string;
}

export interface User {
  codigo_importado: number;
  nome: string;
  username: string;
  codigo: number | null;
  email: string | null;
  obs: string | null;
  user_pertence: string | null;
  created_by: number;
  last_updated_by: number;
  created_at: string;
  updated_at: string;
  last_password_change: string | null;
  active_state: number;
  fotoname: string | null;
  primeiro_log: number;
  numeromaximotentativas: number;
  pk_utilizador: number;
}

export async function loginService(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await axiosNestAuth.post("/auth/login", payload);
  return data;
}
