// hooks/useTipoSuporte.ts
import { 
  createTipoSuporte,
  getAllTiposSuporte,
  listTiposSuporte,
  getTipoSuporteById,
  updateTipoSuporte,
  deleteTipoSuporte,
  TipoSuporte,
  CreateTipoSuportePayload,
  UpdateTipoSuportePayload,
  FilterTipoSuporteParams,
  PaginatedTiposSuporte,
} from '@/services/suporte/tipo-suporte.service'; 

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* =============================================
   Listagem paginada + filtrada de tipos de suporte
   ============================================= */
export const useTiposSuporte = (params: FilterTipoSuporteParams = {}) => {
  const { page = 1, limit = 25, search = '' } = params;

  const queryKey = [
    'tipos-suporte',
    page,
    limit,
    search.trim().toLowerCase(),
  ];

  return useQuery<PaginatedTiposSuporte, Error>({
    queryKey,
    queryFn: () => listTiposSuporte(params),
    staleTime: 5 * 60 * 1000,          // 5 minutos
    gcTime: 10 * 60 * 1000,            // 10 minutos
    retry: 1,
    
  });
};

/* =============================================
   Listagem simples (todos os tipos, sem paginação)
   Útil para dropdowns, selects, etc.
   ============================================= */
export const useAllTiposSuporte = () => {
  const queryKey = ['tipos-suporte-all'];

  return useQuery<TipoSuporte[], Error>({
    queryKey,
    queryFn: () => getAllTiposSuporte(),
    staleTime: 10 * 60 * 1000,         // 10 minutos (tipos mudam pouco)
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

/* =============================================
   Detalhes de um tipo de suporte específico
   ============================================= */
export const useTipoSuporteDetail = (id?: number) => {
  return useQuery<TipoSuporte, Error>({
    queryKey: ['tipo-suporte-detail', id],
    queryFn: () => getTipoSuporteById(id!),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,          // 5 minutos
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
};

/* =============================================
   Mutations (criar, atualizar, eliminar)
   ============================================= */

// Criar novo tipo
export const useCreateTipoSuporte = () => {
  const queryClient = useQueryClient();

  return useMutation<TipoSuporte, Error, CreateTipoSuportePayload>({
    mutationFn: (data) => createTipoSuporte(data),
    onSuccess: () => {
      // Invalida as listagens para refletir a nova entrada
      queryClient.invalidateQueries({ queryKey: ['tipos-suporte'] });
      queryClient.invalidateQueries({ queryKey: ['tipos-suporte-all'] });
    },
  });
};

// Atualizar tipo existente
export const useUpdateTipoSuporte = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TipoSuporte,
    Error,
    { id: number; data: UpdateTipoSuportePayload }
  >({
    mutationFn: ({ id, data }) => updateTipoSuporte(id, data),
    onSuccess: (updatedTipo) => {
      // Atualiza cache do detalhe
      queryClient.setQueryData(['tipo-suporte-detail', updatedTipo.id], updatedTipo);
      
      // Invalida listagens
      queryClient.invalidateQueries({ queryKey: ['tipos-suporte'] });
      queryClient.invalidateQueries({ queryKey: ['tipos-suporte-all'] });
    },
  });
};

// Eliminar tipo
export const useDeleteTipoSuporte = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: (id) => deleteTipoSuporte(id),
    onSuccess: (_, id) => {
      // Remove do cache de detalhe (opcional)
      queryClient.removeQueries({ queryKey: ['tipo-suporte-detail', id] });
      
      // Invalida listagens
      queryClient.invalidateQueries({ queryKey: ['tipos-suporte'] });
      queryClient.invalidateQueries({ queryKey: ['tipos-suporte-all'] });
    },
  });
};

// =============================================
// Função auxiliar para invalidar queries manualmente
// (útil após ações em batch ou de outros lugares)
// =============================================
export const invalidateTiposSuporteQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['tipos-suporte'] });
  queryClient.invalidateQueries({ queryKey: ['tipos-suporte-all'] });
  queryClient.invalidateQueries({ queryKey: ['tipo-suporte-detail'] }); // invalida todos os detalhes
};


