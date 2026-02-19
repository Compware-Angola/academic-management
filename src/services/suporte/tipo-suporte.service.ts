import { axiosNestGa } from "@/lib/axios-nest-ga";

// ──────────────────────────────────────────────
// Tipos / Interfaces
// ──────────────────────────────────────────────

export type TipoSuporte = {
  id: number;
  descricao: string;
};

export type CreateTipoSuportePayload = {
  descricao: string;
};

export type UpdateTipoSuportePayload = {
  descricao?: string;
};

// ──────────────────────────────────────────────
// CRUD Functions
// ──────────────────────────────────────────────

/**
 * Criar um novo tipo de suporte
 */
export async function createTipoSuporte(data: CreateTipoSuportePayload): Promise<TipoSuporte> {
  const response = await axiosNestGa.post("/suporte/tipos", data);
  return response.data;
}

/**
 * Listar todos os tipos de suporte (versão simples, sem paginação)
 */
export async function getAllTiposSuporte(): Promise<TipoSuporte[]> {
  const response = await axiosNestGa.get("/suporte/tipos");
  return response.data;
}

/**
 * Listar tipos de suporte com paginação e pesquisa (se usares a rota paginada)
 */
export type FilterTipoSuporteParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginatedTiposSuporte = {
  data: TipoSuporte[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function listTiposSuporte(
  params: FilterTipoSuporteParams = {}
): Promise<PaginatedTiposSuporte> {
  const response = await axiosNestGa.get("/suporte/tipos-paginado", { params });
  return response.data;
}

/**
 * Obter um tipo de suporte específico por ID
 */
export async function getTipoSuporteById(id: number): Promise<TipoSuporte> {
  const response = await axiosNestGa.get(`/suporte/tipos/${id}`);
  return response.data;
}

/**
 * Atualizar um tipo de suporte existente
 */
export async function updateTipoSuporte(
  id: number,
  data: UpdateTipoSuportePayload
): Promise<TipoSuporte> {
  const response = await axiosNestGa.patch(`/suporte/tipos/${id}`, data);
  return response.data;
}

/**
 * Eliminar um tipo de suporte
 */
export async function deleteTipoSuporte(id: number): Promise<{ message: string }> {
  const response = await axiosNestGa.delete(`/suporte/tipos/${id}`);
  return response.data;
}