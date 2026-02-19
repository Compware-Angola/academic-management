// hooks/useSolicitacoesSuporte.ts
import { 
  listSolicitacoes,
  getSolicitacaoById,
  responderSolicitacao,
  PaginatedSolicitacoes,
  FilterSolicitacoesParams,
  SuporteDetalhado,
  ResponderSolicitacaoPayload,
  RespostaCriada,
} from '@/services/suporte/solicitacao-suporte.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* =============================================
   Listagem paginada + filtrada de solicitações de suporte
   ============================================= */
export const useSolicitacoesSuporte = (params: FilterSolicitacoesParams = {}) => {
  const { 
    page = 1, 
    limit = 25, 
    search = '', 
    tipo_suporte, 
    status 
  } = params;

  const queryKey = [
    'solicitacoes-suporte',
    page,
    limit,
    search.trim().toLowerCase(),
    tipo_suporte ?? null,
    status ?? null,
  ].filter(v => v !== undefined && v !== null); // limpa valores indefinidos

  return useQuery<PaginatedSolicitacoes, Error>({
    queryKey,
    queryFn: () => listSolicitacoes(params),
    staleTime: 3 * 60 * 1000,          // 3 minutos (solicitações mudam com respostas)
    gcTime: 10 * 60 * 1000,
    retry: 1,
    // keepPreviousData: true,         // útil para paginação suave
  });
};

/* =============================================
   Detalhes completos de uma solicitação específica (por ID)
   Inclui respostas associadas
   ============================================= */
export const useSolicitacaoDetail = (id?: number) => {
  return useQuery<SuporteDetalhado, Error>({
    queryKey: ['solicitacao-detail', id],
    queryFn: () => getSolicitacaoById(id!),
    enabled: !!id && id > 0,
    staleTime: 2 * 60 * 1000,         
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/* =============================================
   Mutation para responder uma solicitação
   ============================================= */
export const useResponderSolicitacao = () => {
  const queryClient = useQueryClient();

  return useMutation<RespostaCriada, Error, ResponderSolicitacaoPayload>({
    mutationFn: (payload) => responderSolicitacao(payload),
    onSuccess: (data) => {
 

     
      // Invalida a listagem paginada para refletir a mudança de status
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-suporte'] });
    },
    onError: (error) => {
      console.error('Erro ao responder solicitação:', error);
      // Aqui podes adicionar toast.error se quiseres
    },
  });
};

// =============================================
// Função auxiliar para invalidar queries manualmente
// (útil após ações em batch ou refresh completo)
// =============================================
export const invalidateSolicitacoesQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  solicitacaoId?: number
) => {
  queryClient.invalidateQueries({ queryKey: ['solicitacoes-suporte'] });
  
  if (solicitacaoId) {
    queryClient.invalidateQueries({ queryKey: ['solicitacao-detail', solicitacaoId] });
  }
};