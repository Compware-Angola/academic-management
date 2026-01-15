// src/services/acesso.service.ts  (ou onde preferires colocar)

import { axiosNestGa } from "@/lib/axios-nest-ga";

// Parâmetros que o frontend vai enviar para a API
export type FilterUsersLogadoParams = {
  estado?: 0 | 1 | 2;          // 1 = logado, 0 = não logado, 2 = todos
  search?: string;
  page?: number;
  limit?: number;
};

// Tipo do item retornado em "data"
export type UserLogadoItem = {
  codigo: number;
  nome: string;
  username: string;
  email: string | null;
  ip: string;
  ultimaatividade: string;     // formato: DD/MM/YYYY HH:mm:ss
  logado: number;   
  utilizador:number;           // 0 ou 1
};

// Tipo da resposta paginada completa
export type UsersLogadoPaginatedResponse = {
  data: UserLogadoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Busca utilizadores logados / não logados / todos (paginação + filtro)
 * @param params - Filtros (estado, search, page, limit)
 * @returns Resposta paginada com lista de utilizadores
 */
export async function fetchUsersLogados(
  params: FilterUsersLogadoParams = {}
): Promise<UsersLogadoPaginatedResponse> {
  const defaultParams = {
    estado: 1,     // default: apenas logados
    page: 1,
    limit: 10,
    ...params,     
  };

  const { data } = await axiosNestGa.get<UsersLogadoPaginatedResponse>(
    "/acess_management/users/users-logado",
    { params: defaultParams }
  );

  return data;
}