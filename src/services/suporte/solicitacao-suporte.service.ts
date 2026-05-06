import { axiosNestGa } from "@/lib/axios-nest-ga";

// ──────────────────────────────────────────────
// Tipos / Interfaces
// ──────────────────────────────────────────────
// Interface principal (o objeto raiz)
export interface SuporteDetalhado {
  estudante: string;
  mensagem: string;
  assunto: string;
  descricao_tipo_suporte: string;
  utilizador: string;
  data_mensagem: string;          // formato "DD/MM/YYYY HH:mm:ss"
  status_mensagem: string;         // ex: "respondido", "pendente", etc.
  contactos_id: number;
  mensagem_resposta: string | null;
  data_resposta: string | null;    // pode ser null ou "DD/MM/YYYY HH:mm:ss"
  file_name1: string | null;
  file_name2: string | null;
  file_name3: string | null;
  nome_usuario_resposta: string;
  respostas: RespostaSuporte[];
}

// Interface para cada item do array "respostas"
export interface RespostaSuporte {
  resposta_id: number;
  mensagem_resposta: string;
  data_resposta: string | null;    // null quando ainda não processado ou em alguns casos
  file_name1: string | null;
  file_name2: string | null;
  file_name3: string | null;
  nome_usuario_resposta: string;
  resposta_user_id: number;
}
export type SolicitacaoSuporte = {
  contactos_id: number;
  estudante: string;
  bilhete_identidade: string;
  codigo_matricula: string;
  mensagem: string;
  assunto: string;
  descricao_tipo_suporte: string;
  utilizador: string;
  data_mensagem: string;       // formato DD/MM/YYYY HH:mm:ss
  status_mensagem: number;     // ou string, dependendo do backend
  mensagem_resposta?: string;
  data_resposta?: string;
  file_name1?: string | null;
  file_name2?: string | null;
  file_name3?: string | null;
  nome_usuario_resposta?: string;
};

export type PaginatedSolicitacoes = {
  data: SolicitacaoSuporte[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FilterSolicitacoesParams = {
  page?: number;
  limit?: number;
  search?: string;
  tipo_suporte?: number;
  status?: string;
};

// Payload para responder uma solicitação
export type ResponderSolicitacaoPayload = {
  descricao: string;
  contactos_id: number;
  file_name1?: string | null;
  file_name2?: string | null;
  file_name3?: string | null;
};

// Resposta esperada ao responder
export type RespostaCriada = {
  mensagem: string;
  resposta: {
    id: number;
    descricao: string;
    created_at: string;
    user_id: number;
    contactos_id: number;
  };
  solicitacao: {
    contactos_id: number;
    mensagem_original: string;
    assunto: string;
    status_solicitacao: number;
    resposta_id?: number;
    resposta?: string;
    data_resposta?: string;
    file_name1?: string | null;
    file_name2?: string | null;
    file_name3?: string | null;
  };
};

// ──────────────────────────────────────────────
// Funções do Service
// ──────────────────────────────────────────────

/**
 * Listar solicitações de suporte com paginação e filtros
 */
export async function listSolicitacoes(
  params: FilterSolicitacoesParams = {}
): Promise<PaginatedSolicitacoes> {
  const response = await axiosNestGa.get("/suporte", { params });
  return response.data;
}

/**
 * Responder a uma solicitação de suporte
 * (cria resposta e atualiza status para respondido)
 */
export async function responderSolicitacao(
  payload: ResponderSolicitacaoPayload
): Promise<RespostaCriada> {
  const { contactos_id, ...data } = payload;

  const response = await axiosNestGa.post(
    `/suporte/responder/${contactos_id}`,
    {
      ...data,
      contactos_id, // garantia de consistência
    }
  );

  return response.data;
}

/**
 * (Opcional) Obter uma solicitação específica por ID
 * Útil para detalhes ou refresh após resposta
 */
export async function getSolicitacaoById(id: number): Promise<SuporteDetalhado> {
  const response = await axiosNestGa.get(`/suporte/${id}`);
  return response.data;
}