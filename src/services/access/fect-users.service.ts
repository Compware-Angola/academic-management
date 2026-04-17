// src/services/users.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
// Tipagem da resposta do toggle
export type ToggleUserResponse = {
  success: boolean;
  userId: number;
  nome: string;
  previousState: string;
  newState: string;
  action: string;
  message: string;
  active: boolean;
};

// Tipagem do usuário conforme o retorno da API
export type User = {
  codigo: number;
  nome: string;
  username: string;
  email: string | null;
  activestate: number; // 0 ou 1
  obs: string | null;
  pessoaid: number | null;
  createdat: string | null;
  updatedat: string | null;
  tipodocumentoid: number | null;

  numerodocumento: string | null;
  datadenascimento: string | null;

  telefone1: string | null;
  telefone2: string | null;

  genero: number | null;
  estadocivil: number | null;
  nacionalidade: number | null;


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
 * Alterna o estado (ativo ↔ inativo) de um utilizador
 * @param userId - ID do utilizador (PK_UTILIZADOR)
 */
export async function toggleUserStatus(userId: number): Promise<ToggleUserResponse> {
  try {
    const { data } = await axiosNestGa.patch<ToggleUserResponse>(
      `/acess_management/user/${userId}/toggle-status`
    );

    return data;
  } catch (error: any) {
    console.error(`Erro ao alterar estado do utilizador ${userId}:`, error);
    
    // Retorno amigável em caso de erro
    throw new Error(
      error.response?.data?.message || 
      `Não foi possível alterar o estado do utilizador.`
    );
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
