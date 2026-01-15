
import { axiosNestAuth } from "@/lib/axios-nest-auth";


export class LoginPayload {
  username: string;
  password: string;
  platform?: 'GA' | 'PORTAL' = 'GA';
}
export class LogoutPayload {

  platform?: 'GA' | 'PORTAL' = 'GA';
}



export interface Group {
  codigo: number;
  designation: string;
  sigla: string;
  type_group: number;
  type_group_designation: string;
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
  numeromaximotentaivas: number;
  pk_utilizador: number;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: User;
  groups: Group[];
  mensagem: string;
}
export interface logoutResponse {

  mensagem: string;
}

export interface CurrentUserResponse {
  isAuthenticated: boolean;
  user: User;
  groups?: Group[];       
  message: string;
  platform?: 'GA' | 'PORTAL'; 
}

export async function loginService(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await axiosNestAuth.post<AuthResponse>("/auth/login", payload);
  return data;
}


export async function getCurrentUserService(
  platform: 'GA', 
): Promise<CurrentUserResponse> {
  const { data } = await axiosNestAuth.get<CurrentUserResponse>("/auth/current-user", {
    params: { platform }, 
  });

  return data;
}
export async function logout(variables: { platform: 'GA' }): Promise<logoutResponse> {
  const { platform } = variables;

  const { data } = await axiosNestAuth.post<logoutResponse>("/auth/logout", {
    platform, 
  });

  return data;
}

export async function makLoggedOut(
  utilizadorId: number | string,
  platform: "GA"
): Promise<logoutResponse> {
  const { data } = await axiosNestAuth.patch<logoutResponse>(
    `/auth/mak-logged-out/${utilizadorId}`,
    { platform }
  );

  return data;
}