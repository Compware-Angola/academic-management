// src/services/users.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";

// Tipagem do usuário conforme o retorno da API
export type User = {
  codigo: number;
  nome: string;
  username: string;
  email: string | null;
  activestate: number; // 1 = ativo, 0 = inativo
  obs: string | null;
  createdat: string | null;
  updatedat: string | null;
  numerodocumento: string | null;
  datadenascimento: string | null;
  telefone1: string | null;
  telefone2: string | null;
};

// Tipagem completa da resposta paginada
export type UsersResponse = {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Tipagem da resposta sem paginação
export type UsersListResponse = {
  data: User[];
  total: number;
};

// Parâmetros opcionais da busca
export type FetchUsersParams = {
  ativo?: boolean;     // filtra por utilizadores ativos
  page?: number;       // página atual
  limit?: number;      // quantos por página
  search?: string;     // busca por nome ou username
};

/**
 * Busca lista de utilizadores da API de acess_management (com paginação)
 */
export async function fetchUsers(params: FetchUsersParams = {}): Promise<UsersResponse> {
  try {
    const {
      ativo,
      page = 1,
      limit = 25,
      search = "",
    } = params;

    const { data } = await axiosNestGa.get<UsersResponse>("/acess_management/users", {
      params: {
        ativo,
        page,
        limit,
        ...(search && { search }), 
      },
    });

    return {
      data: data.data ?? [],
      total: data.total ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? 25,
      totalPages: data.totalPages ?? 1,
    };
  } catch (error) {
    console.error("Erro ao carregar utilizadores:", error);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 25,
      totalPages: 0,
    };
  }
}

/**
 * Busca todos os utilizadores da API de acess_management (sem paginação)
 */
export async function fetchUsersNoPagination(params: FetchUsersParams = {}): Promise<UsersListResponse> {
  try {
    const { ativo, search = "" } = params;

    const { data } = await axiosNestGa.get<UsersListResponse>("/acess_management/users-no-pagination", {
      params: {
        ativo,
        ...(search && { search }),
      },
    });

    return {
      data: data.data ?? [],
      total: data.total ?? 0,
    };
  } catch (error) {
    console.error("Erro ao carregar utilizadores sem paginação:", error);
    return {
      data: [],
      total: 0,
    };
  }
}

/**
 * Versão simplificada para autocomplete/select:
 * - Com paginação retorna só o array de users
 */
export async function fetchUsersList(params?: FetchUsersParams): Promise<User[]> {
  const response = await fetchUsers(params);
  return response.data;
}

/**
 * Versão simplificada para autocomplete/select:
 * - Sem paginação retorna só o array de users
 */
export async function fetchUsersListNoPagination(params?: FetchUsersParams): Promise<User[]> {
  const response = await fetchUsersNoPagination(params);
  return response.data;
}
