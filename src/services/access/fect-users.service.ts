// src/services/users.service.ts (ou o caminho que preferir)

import { axiosNestGa } from "@/lib/axios-nest-ga";

// Tipagem do usuário conforme o novo retorno da API
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

// Parâmetros opcionais da busca
export type FetchUsersParams = {
  ativo?: boolean;     // filtra por utilizadores ativos (default: true)
  page?: number;       // página atual (default: 1)
  limit?: number;      // quantos por página (default: 25)
  search?: string;     // busca por nome ou username
};

/**
 * Busca lista de utilizadores da nova API de acess_management
 * @param params Filtros opcionais (ativo, paginação, busca)
 * @returns Objeto com dados paginados
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

    // Garante valores padrão caso a API retorne algo inesperado
    return {
      data: data.data ?? [],
      total: data.total ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? 25,
      totalPages: data.totalPages ?? 1,
    };
  } catch (error) {
    console.error("Erro ao carregar utilizadores:", error);
    // Retorna estrutura vazia para não quebrar a UI
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
 * Versão simplificada: só retorna o array de users (útil para selects, autocomplete, etc)
 */
export async function fetchUsersList(params?: FetchUsersParams): Promise<User[]> {
  const response = await fetchUsers(params);
  return response.data;
}